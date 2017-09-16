import {ConfEager} from "./ConfEager";
import {ConfEagerProperty} from "./ConfEagerProperty";
import {MissingPropertiesError} from "./ConfEagerErrors";

/**
 * Represents a source of configuration,
 * this may be, for example, environment variables, MySQL, configuration file,
 * or any other source.
 *
 * A fully customized configuration source may be created by implementing
 * ConfEagerSource._get method, which returns a string value of a given
 * configuration property key, and implementing ConfEagerSource.notifyUpdate
 * whenever the data in the source has changed.
 * The latter will automatically update all the ConfEager classes that
 * are bound to this source.
 */
export abstract class ConfEagerSource {

    // Fields

    private readonly _confEagerMapping = new Map<ConfEager, ConfEagerProperty<any>[]>();

    // Public

    /**
     * Receive a ConfEager instance and bind it to the current source.
     * Whenever the source changes, all bound instances are automatically updated.
     *
     * @param {ConfEager} confEagerObject   instance to bind
     */
    public bind(confEagerObject: ConfEager): void {
        if (!this._confEagerMapping.get(confEagerObject)) {
            const properties: ConfEagerProperty<any>[] = [];
            for (const key of Object.keys(confEagerObject)) {
                const property = (confEagerObject as any)[key];
                if (property && property instanceof ConfEagerProperty) {
                    (property as any)._reportPropertyKey(key);
                    properties.push(property);
                }
            }
            this._populate(confEagerObject, properties);
            this._confEagerMapping.set(confEagerObject, properties);
        }
    }

    // Private

    /**
     * Should be called whenever the source data changes,
     * triggers a re-population of  all bound ConfEager instances.
     */
    protected notifyUpdate(): void {
        for (const [key, value] of this._confEagerMapping) {
            this._populate(key, value);
        }
    }

    /**
     * Extracts the String value of a property. No parsing needed.
     *
     * @param {string} propertyKey  the key of the property to extract
     * @returns {string}
     * @private
     */
    protected abstract _get(propertyKey: string): string | null | undefined;

    private _populate(instance: ConfEager, properties: ConfEagerProperty<any>[]): void {
        const missingProperties: string[] = [];
        for (const property of properties) {
            const propertyName = (instance as any)._prefix() +
                (property as any)._getPropertyKey();
            const value = this._get(propertyName);
            if (value === null || typeof value == "undefined") {
                if ((property as any)._isRequired()) {
                    missingProperties.push("`" + propertyName + "`");
                }
            }
            else {
                (property as any)._update(value.toString());
            }
        }
        if (missingProperties.length > 0) {
            throw new MissingPropertiesError(missingProperties);
        }
    }

}