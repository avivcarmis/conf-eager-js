import {ReadBeforeWriteError} from "./ConfEagerErrors";

/**
 * Represents a configuration property.
 * Concrete classes that inherit this class should be used as fields of a
 * {@link ConfEager} implementation.
 *
 * Custom property types may easily be created by inheriting this class and
 * implementing {@link #map(String)}.
 */
export abstract class ConfEagerProperty<T> {

    // Properties

    private _required: boolean;

    private _propertyKey: string | null;

    private _value: T | null;

    // Constructors

    constructor() {
        this._required = true;
        this._value = null;
    }

    // Public

    /**
     * @return the configuration property value currently in memory
     */
    public get(): T {
        if (this._value === null) {
            throw new ReadBeforeWriteError(this._propertyKey!);
        }
        return this._value;
    }

    public withDefaultValue(value: T): this {
        this._required = false;
        this._value = value;
        return this;
    }

    public withPropertyKey(key: string): this {
        this._propertyKey = key;
        return this;
    }

    // Private

    public _update(value: string): void {
        this._value = this.map(value);
    }

    public _reportPropertyKey(fieldName: string): void {
        if (this._propertyKey == null) {
            this._propertyKey = fieldName;
        }
    }

    public _getPropertyKey(): string {
        return this._propertyKey!;
    }

    public _isRequired(): boolean {
        return this._required;
    }

    /**
     * @param value string representation of the value
     * @return the parsed value to be stored.
     */
    protected abstract map(value: string): T;

}