import {Constructable, SmokeScreen} from "smoke-screen";
import * as fs from "fs";
import * as util from "util";
import * as yaml from "yamljs";
import * as properties from "properties";

const SMOKE_SCREEN = new SmokeScreen();

/**
 * Represents a source of configuration,
 * this may be, for example, environment variables, MySQL, configuration file,
 * or any other source.
 *
 * A fully customized configuration source may be created by implementing
 * ConfEagerSource.getData method, which returns the currently updated data
 * object of the source, and by calling the inherited ConfEagerSource.notifyUpdate
 * method whenever the data in the source has changed.
 * The latter will automatically update all the ConfEager classes that
 * are bound to this source.
 */
export abstract class ConfEagerSource {

    private readonly _boundInstances: any[] = [];

    /**
     * Receive a class contains @exposed fields, instantiate it, binds it
     * and returns the newly create bound instance.
     * Whenever the source changes, all bound instances are automatically updated.
     *
     * @param {Constructable<T>} configurationClass     the class to instantiate
     * @returns {T}                                     the bound instance
     */
    create<T>(configurationClass: Constructable<T>) {
        const instance = new configurationClass();
        this.bind(instance);
        return instance;
    }

    /**
     * Receive a ConfEager instance and bind it to the current source.
     * Whenever the source changes, all bound instances are automatically updated.
     *
     * @param instance  instance to bind
     */
    bind(instance: any) {
        SMOKE_SCREEN.updateFromObject(this.getData(), instance);
        this._boundInstances.push(instance);
    }

    /**
     * Should be called whenever the source data changes,
     * triggers a re-population of  all bound ConfEager instances.
     */
    protected notifyUpdate(): void {
        for (const instance of this._boundInstances) {
            SMOKE_SCREEN.updateFromObject(this.getData(), instance);
        }
    }

    /**
     * @returns {{[p: string]: any}}    a JS object containing all the parsed
     *                                  data in the source
     */
    protected abstract getData(): { [key: string]: any };

}

/**
 * Out of the box configuration sources.
 */
export namespace ConfEagerSources {

    /**
     * Abstract base class for implementation of file based sources
     */
    export abstract class FileSource extends ConfEagerSource {

        private _data: { [key: string]: any };

        constructor(private readonly _filename: string,
                    private readonly _watchInterval: number,
                    private readonly _encoding: string | null = null) {
            super();
            this.triggerUpdate();
            if (this._watchInterval > 0) {
                fs.watchFile(
                    this._filename,
                    {interval: this._watchInterval},
                    this.listener
                );
            }
        }

        close() {
            fs.unwatchFile(this._filename, this.listener);
        }

        protected abstract parse(content: string): { [key: string]: any };

        protected getData(): { [p: string]: any } {
            return this._data;
        }

        private listener = () => this.triggerUpdate();

        private triggerUpdate() {
            const fileContents = fs
                .readFileSync(this._filename, {encoding: this._encoding})
                .toString();
            try {
                this._data = this.parse(fileContents);
            } catch (e) {
                throw new Error(util.format(
                    "could not parse configuration file %s, with value %s",
                    this._filename, fileContents));
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

        protected getData(): { [p: string]: any } {
            return process.env;
        }

    }

    /**
     * Out of the box source to receive other sources prioritizes from
     * high to low, and combine them together, where a higher priority
     * source may override values of a lower priority one.
     */
    export class Combinator extends ConfEagerSource {

        private readonly _sources: ConfEagerSource[];

        constructor(...sources: ConfEagerSource[]) {
            super();
            this._sources = sources;
        }

        protected getData(): { [key: string]: any } {
            const result: { [key: string]: any } = {};
            for (let i = this._sources.length - 1; i >= 0; i--) {
                const data = (this._sources[i] as any).getData();
                for (const key of Object.keys(data)) {
                    result[key] = data[key];
                }
            }
            return result;
        }

    }

    /**
     * Out of the box source to map a given data object
     */
    export class StubSource extends ConfEagerSource {

        constructor(private _data: { [p: string]: any }) {
            super();
        }

        update(data: { [p: string]: any }) {
            this._data = data;
            this.notifyUpdate();
        }

        protected getData(): { [p: string]: any } {
            return this._data;
        }

    }

}
