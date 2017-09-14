/**
 * Represents a configuration property.
 * Concrete classes that inherit this class should be used as fields of a
 * {@link ConfEager} implementation.
 *
 * Custom property types may easily be created by inheriting this class and
 * implementing {@link #map(String)}.
 */
import {DefaultValue, PropertyName} from "./ConfEager";
import {ReadBeforeWriteError} from "./ConfEagerErrors";

export abstract class ConfEagerProperty<T> {

    // Properties

    private readonly _required: boolean;

    private _propertyName: string|null;

    private _value: T|null;

    // Constructors

    constructor(defaultValue?: DefaultValue<T>, propertyName?: PropertyName) {
        if (defaultValue) {
            this._required = false;
            this._value = defaultValue.value;
        }
        else {
            this._required = true;
            this._value = null;
        }
        if (propertyName) {
            this._propertyName = propertyName.name;
        }
    }

    // Public

    /**
     * @return the configuration property value currently in memory
     */
    public get(): T {
        if (this._value === null) {
            throw new ReadBeforeWriteError(this._propertyName!);
        }
        return this._value;
    }

    // Private

    public _update(value: string): void {
        this._value = this.map(value);
    }

    public _setFieldName(fieldName: string): void {
        if (this._propertyName == null) {
            this._propertyName = fieldName;
        }
    }

    public _getPropertyName(): string {
        return this._propertyName!;
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