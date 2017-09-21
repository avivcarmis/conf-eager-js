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
 * Additionally, a prefix path may be set to all of the property keys by
 * overriding pathKeys method. This may be used to tell confeager to lookup
 * property names in a specified path in the source. If for example the source
 * is a YAML file that looks like that:
 *
 * dataCenter1:
 *  staging:
 *    url: http://staging.dc1.example.com
 *  production:
 *    url: http://production.dc1.example.com
 * dataCenter2:
 *  staging:
 *    url: http://staging.dc2.example.com
 *  production:
 *    url: http://production.dc2.example.com
 *
 * and we would like to host the value of dataCenter1's staging, we may use
 * pathKeys to return ["dataCenter1", "staging"] and have a single property
 * called "url", then we would get the value of dataCenter1.staging.url
 */
export abstract class ConfEager {

    // noinspection JSUnusedGlobalSymbols
    protected pathKeys(): string[] {
        return [];
    }

}