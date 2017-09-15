import {ConfEagerSource} from "./ConfEagerSource";

export namespace ConfEagerSources {

    /**
     * Out of the box source to map Environment Variables
     */
    export class EnvironmentVariables extends ConfEagerSource {

        _get(propertyName: string): string | null | undefined {
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

        _get(propertyName: string): string | null | undefined {
            for (const source of this._sources) {
                const value = source._get(propertyName);
                if (value != null) {
                    return value;
                }
            }
            return null;
        }

    }

}