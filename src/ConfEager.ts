/**
 * Represents a configuration class.
 * Each inheritor will declare it's configuration properties as the class fields,
 * each property must inherit {@link ConfEagerProperty}.
 *
 * Each declared property is looked for in the source by it's field name. To override it,
 * use {@link #propertyName(String)} method to explicitly declare the property name to look for.
 *
 * Each declared property is required by default, to change it, use {@link #defaultValue(Object)}
 * method to explicitly declare what value should be used in case no value appears in the source.
 *
 * By default, static fields are ignored. Which fields get ignored are controlled by the
 * {@link #defaultFieldFilter(Field)} method which may be overridden.
 *
 * Additionally, a prefix may be set to all of the property names by overriding
 * {@link #_prefix()} method. This may be used to discriminate between
 * different development environments.
 */
export abstract class ConfEager {

    public _prefix(): string {
        return "";
    }

}