/**
 * Represents a configuration class.
 *
 * Each inheritor will declare it's configuration properties as
 * the class fields, each property must inherit from ConfEagerProperty.
 *
 * Each declared ConfEagerProperty property is looked for in the source
 * by it's field name by default. To override it, use ConfEagerProperty.withPropertyKey
 * method and explicitly declare the property name to look for.
 *
 * Each declared property is required by default, to change it,
 * use ConfEagerProperty.withDefaultValue method to explicitly
 * declare what value should be used in case no value appears in the source.
 *
 * Additionally, a prefix may be set to all of the property names by
 * overriding _prefix method. This may be used, for example, to discriminate
 * between different development environments, or to connect configuration
 * classes to certain areas of configuration files.
 */
export abstract class ConfEager {

    protected _prefix(): string {
        return "";
    }

}