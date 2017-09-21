import {ConfEagerSource} from "./ConfEagerSource";
import {ConfEagerErrors} from "./ConfEagerErrors";
import * as fs from "fs";
import * as yaml from "yamljs";
import * as properties from "properties";

/**
 * Out of the box configuration sources.
 */
export namespace ConfEagerSources {

    import CouldNotParseConfigurationFileError =
        ConfEagerErrors.CouldNotParseConfigurationFileError;

    // Utils

    export function extractPath(data: any, path: string[]): string | null {
        if (path.length == 0) {
            return data;
        }
        if (!data) {
            return null;
        }
        return extractPath(data[path[0]], path.slice(1));
    }

    // Sources

    /**
     * Abstract base class for implementation of file based sources
     */
    export abstract class FileSource extends ConfEagerSource {

        private _data: any;

        private _listener = () => this._triggerUpdate();

        constructor(private readonly _filename: string,
                    private readonly _watchInterval: number,
                    private readonly _encoding: string | null = null) {
            super();
            this._triggerUpdate();
            if (this._watchInterval > 0) {
                fs.watchFile(
                    this._filename,
                    {interval: this._watchInterval},
                    this._listener
                );
            }
        }

        close() {
            fs.unwatchFile(this._filename, this._listener);
        }

        protected abstract parse(content: string): any;

        protected get(path: string[]): string | null | undefined {
            const value = extractPath(this._data, path);
            if (value == null || typeof value == "undefined") {
                return null;
            }
            if (typeof value == "object") {
                return JSON.stringify(value);
            }
            return value.toString();
        }

        private _triggerUpdate() {
            const fileContents = fs
                .readFileSync(this._filename, {encoding: this._encoding})
                .toString();
            try {
                this._data = this.parse(fileContents);
            } catch (e) {
                throw new CouldNotParseConfigurationFileError(this._filename,
                    fileContents);
            }
            this.notifyUpdate();
        }

    }

    /**
     * Out of the box source to read from JSON files
     */
    export class JsonFile extends FileSource {

        constructor(filename: string, watchInterval: number,
                    encoding: string | null = null) {
            super(filename, watchInterval, encoding);
        }

        protected parse(content: string) {
            return JSON.parse(content);
        }

    }

    /**
     * Out of the box source to read from YAML files (*.yaml | *.yml)
     */
    export class YamlFile extends FileSource {

        constructor(filename: string, watchInterval: number,
                    encoding: string | null = null) {
            super(filename, watchInterval, encoding);
        }

        protected parse(content: string) {
            return yaml.parse(content);
        }

    }

    /**
     * Out of the box source to read from properties files (*.properties)
     */
    export class PropertiesFile extends FileSource {

        constructor(filename: string, watchInterval: number,
                    encoding: string | null = null) {
            super(filename, watchInterval, encoding);
        }

        protected parse(content: string) {
            return properties.parse(content, {path: false});
        }

    }

    /**
     * Out of the box source to map Environment Variables
     */
    export class EnvironmentVariables extends ConfEagerSource {

        protected get(path: string[]): string | null | undefined {
            const value = extractPath(process.env, path);
            return value ? value : null;
        }

    }

    /**
     * Out of the box source to receive other sources,
     * and chain them one after the other for each property,
     * until it is found in either of them.
     */
    export class Combinator extends ConfEagerSource {

        private readonly _sources: ConfEagerSource[];

        constructor(...sources: ConfEagerSource[]) {
            super();
            this._sources = sources;
        }

        protected get(path: string[]): string | null | undefined {
            for (const source of this._sources) {
                const value = (source as any).get(path);
                if (value != null) {
                    return value;
                }
            }
            return null;
        }

    }

    /**
     * Out of the box source to map a given data object
     */
    export class StubSource extends ConfEagerSource {

        constructor(private readonly _data: any) {
            super();
        }

        protected get(path: string[]): string | null | undefined {
            const value = extractPath(this._data, path);
            if (value == null || typeof value == "undefined") {
                return null;
            }
            if (typeof value == "object") {
                return JSON.stringify(value);
            }
            return value.toString();
        }

    }

}