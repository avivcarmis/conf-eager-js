import {ReadBeforeWriteError} from "./ConfEagerErrors";

/**
 * Represents a configuration property.
 * Concrete classes that inherit this class should be used as
 * properties of a ConfEager inheritor.
 *
 * Custom property types may easily be created by inheriting
 * this class and implementing ConfEagerProperty.map method.
 */
export abstract class ConfEagerProperty<T> {

    // Properties

    private _required = true;

    private _propertyKey: string | null = null;

    private _value: T | null = null;

    // Public

    /**
     * @return the configuration property value currently in memory
     */
    get(): T {
        if (this._value === null) {
            throw new ReadBeforeWriteError(this._propertyKey!);
        }
        return this._value;
    }

    /**
     * Sets a default value for the property, and makes it non-required.
     *
     * @param value     the default value to use
     * @returns {this}
     */
    withDefaultValue(value: T): this {
        this._required = false;
        this._value = value;
        return this;
    }

    /**
     * Overrides the key to look for in the configuration source.
     *
     * @param {string} key  the key to set
     * @returns {this}
     */
    withPropertyKey(key: string): this {
        this._propertyKey = key;
        return this;
    }

    // Private

    /**
     * Must be called by the configuration source on binding this property,
     * and before populating it. This reports the property name to use,
     * in case no explicit property name already set.
     *
     * @param {string} propertyKey  the property key to use
     * @private
     */
    protected _reportPropertyKey(propertyKey: string): void {
        if (this._propertyKey == null) {
            this._propertyKey = propertyKey;
        }
    }

    protected _update(value: string): void {
        this._value = this.map(value);
    }

    /**
     * @param value string representation of the value
     * @return the parsed value to be stored.
     */
    protected abstract map(value: string): T;

    // Etc

    protected _getPropertyKey(): string {
        return this._propertyKey!;
    }

    protected _isRequired(): boolean {
        return this._required;
    }

}