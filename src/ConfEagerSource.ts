/**
 * Represents a source of configuration,
 * this may be for example system properties or environment variables which
 * are available by default, or MySQL, Consul or any other source, by simply
 * extending this class and implementing methods.
 *
 * To create a custom source, implement {@link #getValueOrNull(String)} method,
 * and call {@link #notifyUpdate()} whenever the data in the source has changed,
 * this will automatically update all the {@link ConfEager} classes that are bound
 * to this source.
 */
import {ConfEager} from "./ConfEager";
import {ConfEagerProperty} from "./ConfEagerProperty";
import {ConfEagerError} from "./ConfEagerError";
import error = ConfEagerError.error;
import Type = ConfEagerError.Type;

export abstract class ConfEagerSource {

    // Fields

    private readonly _confEagerMapping: Map<ConfEager, ConfEagerProperty<any>[]>;

    // Constructors

    constructor() {
        this._confEagerMapping = new Map();
    }

    // Public

    /**
     * Receive a {@link ConfEager} instance and bind it to the current source.
     *
     * Whenever the source changes, all bound instances are automatically updated.
     *
     * @param confEagerObject instance to bind
     */
    public bind(confEagerObject: ConfEager): void {
        if (!this._confEagerMapping.get(confEagerObject)) {
            const properties: ConfEagerProperty<any>[] = [];
            for (const key of Object.keys(confEagerObject)) {
                if (confEagerObject.defaultPropertyFilter(key)) {
                    const property = (confEagerObject as any)[key];
                    if (property && property instanceof ConfEagerProperty) {
                        (property as ConfEagerProperty<any>)._setFieldName(key);
                        properties.push(property);
                    }
                }
            }
            this.populate(confEagerObject, properties);
            this._confEagerMapping.set(confEagerObject, properties);
        }
    }

    // Private

    /**
     * Must be called whenever the source data changes, in order to propagate
     * changes to all bound {@link ConfEager} instances.
     */
    protected notifyUpdate():void {
        for (const [key, value] of this._confEagerMapping) {
            this.populate(key, value);
        }
    }

    private populate(confEagerObject: ConfEager, properties: ConfEagerProperty<any>[]): void {
        const missingProperties: string[] = [];
        for (const property of properties) {
            const env = confEagerObject.defaultEnvironment();
            const propertyName = (env == null ? "" : env) + property._getPropertyName();
            const value = this._get(propertyName);
            if (value === null) {
                if (property._isRequired()) {
                    missingProperties.push("`" + propertyName + "`");
                }
            }
            else {
                property._update(value);
            }
        }
        if (missingProperties.length > 0) {
            throw error(Type.MISSING_PROPERTIES_ERROR,
                "confEager object missing properties: %s", missingProperties);
        }
    }

    /**
     * Extracts the String value of a property. No parsing needed.
     *
     * @param propertyName the name of the property to extract.
     * @return the String value of a property
     */
    abstract _get(propertyName: string): string | null;

}