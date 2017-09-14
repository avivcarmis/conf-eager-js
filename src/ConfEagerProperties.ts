import {ConfEagerProperty} from "./ConfEagerProperty";
import {DefaultValue, PropertyName} from "./ConfEager";
import {IllegalPropertyValueError} from "./ConfEagerErrors";
const NUMBER_PARSER = Number;

export namespace ConfEagerProperties {

    // Utils

    function booleanMapper(value: string): boolean {
        value = value.trim().toLowerCase();
        if (value == "true" || value == "1") {
            return true;
        }
        if (value == "false" || value == "0") {
            return false;
        }
        throw new IllegalPropertyValueError("boolean", value);
    }

    function numberMapper(value: string): number {
        const result = NUMBER_PARSER(value.trim().toLowerCase());
        if (isNaN(result)) {
            throw new IllegalPropertyValueError("number", value);
        }
        return result;
    }

    export abstract class Array<T> extends ConfEagerProperty<T[]> {

        protected map(value: string): T[] {
            const result = [];
            for (let s of value.split(",")) {
                const trimmed = s.trim();
                if (trimmed == "") {
                    continue;
                }
                result.push(this.mapElement(trimmed));
            }
            return result;
        }

        protected abstract mapElement(value: string): T;

    }

    // Exports

    /**
     * Out of the box ConfEagerProperty that maps string values.
     */
    export class String extends ConfEagerProperty<string> {

        protected map(value: string): string {
            return value;
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps numeric values.
     */
    export class Number extends ConfEagerProperty<number> {

        protected map(value: string): number {
            return numberMapper(value);
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps boolean values.
     */
    export class Boolean extends ConfEagerProperty<boolean> {

        protected map(value: string): boolean {
            return booleanMapper(value);
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps string array values.
     */
    export class StringArray extends Array<string> {

        protected mapElement(value: string): string {
            return value;
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps numeric array values.
     */
    export class NumberArray extends Array<number> {

        protected mapElement(value: string): number {
            return numberMapper(value);
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps boolean array values.
     */
    export class BooleanArray extends Array<boolean> {

        protected mapElement(value: string): boolean {
            return booleanMapper(value);
        }

    }

    /**
     * Out of the box ConfEagerProperty that maps boolean array values.
     */
    export class Enum<T> extends ConfEagerProperty<T> {

        private readonly _enumClass: T;

        private readonly _caseSensitive: boolean;

        constructor(enumClass: T, caseSensitive: boolean, defaultValue?: DefaultValue<T>,
                    propertyName?: PropertyName) {
            super(defaultValue, propertyName);
            this._enumClass = enumClass;
            this._caseSensitive = caseSensitive;
        }

        protected map(value: string): T {
            if (this._caseSensitive) {
                const result = (this._enumClass as any)[value];
                if (typeof result != "undefined") {
                    return result;
                }
            }
            else {
                for (const key of Object.keys(this._enumClass)) {
                    if (!isNaN(NUMBER_PARSER(key))) {
                        // numeric, this is a value not a key
                        continue;
                    }
                    if (key.toLowerCase() == value.trim().toLowerCase()) {
                        return (this._enumClass as any)[key];
                    }
                }
            }
            throw new IllegalPropertyValueError("enum", value);
        }


    }

}