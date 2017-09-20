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

        protected get(propertyKey: string): string | null | undefined {
            return this._data ? this._data[propertyKey] : null;
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

        get(propertyName: string): string | null | undefined {
            const value = process.env[propertyName];
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

        get(propertyName: string): string | null | undefined {
            for (const source of this._sources) {
                const value = (source as any).get(propertyName);
                if (value != null) {
                    return value;
                }
            }
            return null;
        }

    }

}