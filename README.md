# ConfEagerJS

[![ConfEagerJs Build Status at Travis CI](https://api.travis-ci.org/avivcarmis/conf-eager-js.svg?branch=master)]("https://api.travis-ci.org/avivcarmis/conf-eager-js.svg?branch=master")

ConfEagerJS is an eager, strongly-typed configuration library for JavaScript, designed to maximize runtime safety, while maintaining lightweight, easy integration and dynamic nature.
More on the motivation for this project [can be found below](#why "can be found below").

## Quick Start

Installation via NPM:

`$ npm install confeager --save`

> Comparability Note: ConfEagerJS uses [Smoke Screen library](https://www.npmjs.com/package/smoke-screen "Smoke Screen library")
to define and validate object schemas and types at runtime. This requires usage of 
EcmaScript decorators. While EcmaScript doesn't officially support decorators yet, the examples below are implemented in TypeScript, but may also be implemented in any other way that compiles decorators.

Consider a YAML configuration file `config.yaml`:
```yaml
host: 0.0.0.0           # string
port: 8080              # number
https: false            # boolean
logLevel: INFO          # enum
nestedConfiguration:    # object
  nestedProperty: 1234
arrayConfiguration:     # array
  - 1234
  - 2345
```

Then a consumer written in TypeScript:
```typescript
import {exposed, PropertyTypes} from "smoke-screen";
import {ConfEagerSources} from "confeager";

enum LogLevel {
    INFO, WARN, ERROR
}

class NestedConfiguration {

    @exposed({type: PropertyTypes.number})
    readonly nestedProperty: number;

}

class Configuration {

    @exposed({type: PropertyTypes.string})
    readonly host: string;

    @exposed({type: PropertyTypes.number})
    readonly port: number;

    // note the following property, it's called `useHttps` but exposed as `https`:    
    @exposed({as: "https", type: PropertyTypes.number})
    readonly useHttps: boolean;

    // enum property of enum class LogLevel
    // valid values may only be `INFO`, `WARN` or `ERROR`
    @exposed({type: PropertyTypes.enumOf(LogLevel)})
    readonly logLevel: LogLevel;

    @exposed({type: PropertyTypes.objectOf(NestedConfiguration)})
    readonly nestedConfiguration: NestedConfiguration;

    @exposed({type: PropertyTypes.arrayOf(PropertyTypes.number)})
    readonly arrayConfiguration: number[];

    // all other properties are required and their absence
    // from the source will cause an error on init,
    // this property is optional and when absent will be
    // populated with the value "value"
    @exposed({type: PropertyTypes.string, defaultValue: "value"})
    readonly optionalProperty: string;

}

// load config data from a yaml file with a watch interval of
// 10 milliseconds into a conf eager source.
const source = new ConfEagerSources.YamlFile("config.yaml", 10);
// now use the source to instantiate a configuration object
// and bind it to the source, so that when the source data
// updated, the configuration instance immidietaly gets updated too.
const conf = source.create(Configuration);

// that's it, let's use it!
conf.host;                                // => "0.0.0.0"
conf.port;                                // => 8080
conf.useHttps;                            // => false
conf.logLevel;                            // => LogLevel.INFO
conf.nestedConfiguration.nestedProperty;  // => 1234
conf.arrayConfiguration;                  // => [1234, 2345]
conf.optionalProperty;                    // => "value"
```

Full documentation can be found on the project [WIKI on GitHub](https://github.com/avivcarmis/conf-eager-js/wiki "WIKI on GitHub").

## Why?
ConfEagerJS is designed with two main charachteristics: being eager and being strongly-typed. This is a very powerful combination that provides a few main advantages.

As opposed to popular configuration libraries, ConfEagerJS provides you with an 
interface for declaring your exact expectations from the configuration data. In addition, properties are eagerly loaded and validated. This combination renders a system that validates your entire configuration data source at boot time. The existance and value validity of each property in the source is validated immidiately. This also means no need to check for `null` and no null pointer errors either. This means no more typos when reading from the configuration, and most importantly, this means that to discover these kind of bugs you do not have to discover the exact control flow that triggers it, but rather let ConfEager find it for you when it loads.

Additionally, ConfEagerJS is aimed to provide simple means to easily implement any data source you like, seamlessly get data updates from it without the need to restart your application, and consume any property type you would like from it.

ConfEagerJS follows a [big sister project for Java](https://github.com/avivcarmis/conf-eager "big sister project for Java").

## Useful Links
- [The project GitHub page](https://github.com/avivcarmis/conf-eager-js "The project GitHub page")
- [The project Issue Tracker on GitHub](https://github.com/avivcarmis/conf-eager-js/issues "The project Issue Tracker on GitHub")
- [The project build Status at Travis CI](https://travis-ci.org/avivcarmis/conf-eager-js "The project build Status at Travis CI")

## License
ConfEagerJS is registered under <a href=/LICENSE.txt target="_blank">MIT</a> license.

## Contribution
Really, any kind of contribution will be warmly accepted. (:
