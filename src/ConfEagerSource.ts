import {ConfEager} from "./ConfEager";
import {ConfEagerProperty} from "./ConfEagerProperty";
import {ConfEagerErrors} from "./ConfEagerErrors";
import MissingPropertiesError = ConfEagerErrors.MissingPropertiesError;

/**
 * Represents a source of configuration,
 * this may be, for example, environment variables, MySQL, configuration file,
 * or any other source.
 *
 * A fully customized configuration source may be created by implementing
 * ConfEagerSource.get method, which returns a string value of a given
 * configuration property key, and implementing ConfEagerSource.notifyUpdate
 * whenever the data in the source has changed.
 * The latter will automatically update all the ConfEager classes that
 * are bound to this source.
 */
export abstract class ConfEagerSource {

    // Fields

    private readonly _confEagerMapping = new Map<ConfEager, ConfEagerProperty<any>[]>();

    private readonly _onUpdateListeners: (() => void)[] = [];

    // Public

    /**
     * Receive a ConfEager instance and bind it to the current source.
     * Whenever the source changes, all bound instances are automatically updated.
     *
     * @param {ConfEager} confEagerObject   instance to bind
     */
    bind(confEagerObject: ConfEager): void {
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

    /**
     * Registers a listener to be called whenever the source is updated
     * @param {() => void} listener to call
     */
    onUpdate(listener: () => void) {
        this._onUpdateListeners.push(listener);
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
        for (const listener of this._onUpdateListeners) {
            listener();
        }
    }

    /**
     * Extracts the String value of a property.
     * To return an array or an object, a JSON representation string
     * should be returned (i.e. "[1, 2, 3]" for array,
     * "{\"key\": \"value\"}" for object.
     *
     * @param {string[]} path  the path of keys of the requested value
     * @returns {string}
     * @private
     */
    protected abstract get(path: string[]): string | null | undefined;

    private _populate(instance: ConfEager, properties: ConfEagerProperty<any>[]): void {
        const missingProperties: string[] = [];
        for (const property of properties) {
            const path = (instance as any).pathKeys();
            path.push((property as any)._getPropertyKey());
            const value = this.get(path);
            if (value === null || typeof value == "undefined") {
                if ((property as any)._isRequired()) {
                    missingProperties.push("`" + path.join(".") + "`");
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