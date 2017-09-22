# ConfEagerJS

[![ConfEagerJs Build Status at Travis CI](https://api.travis-ci.org/avivcarmis/conf-eager-js.svg?branch=master)]("https://api.travis-ci.org/avivcarmis/conf-eager-js.svg?branch=master")

ConfEagerJS is an eager, strongly-typed configuration library for JavaScript, designed to maximize runtime safety, while maintaining lightweight, easy integration and dynamic nature.
More on the motivation for this project [can be found below](#why "can be found below").

## Quick Start

Installation via NPM:

`$ npm install confeager --save`

Consider a YAML configuration file `config.yaml`:
```yaml
host: 0.0.0.0                 # string
port: 8080                     # number
https: false                    # boolean
logLevel: INFO             # enum
nestedConfiguration:    # object
  nestedProperty: 1234
arrayConfiguration:       # array
  - 1234
  - 2345
```

Then a consumer written in JavaScript (followed by TypeScript):
```javascript
const confeager = require("confeager");
const {ConfEager, ConfEagerProperties, ConfEagerSources} = confeager;

const LogLevel = {
    INFO: 0, WARN: 1, ERROR: 2
};

class Configuration extends ConfEager {
    
    constructor() {
        
        super();
        
        // string property
        this.host = new ConfEagerProperties.String();
        
        // number property
        this.port = new ConfEagerProperties.Number();
        
        // boolean property with an explicit key,
        // note that the class property is called `useHttps`,
        // but the config property is called `https`
        this.useHttps = new ConfEagerProperties.Boolean().withPropertyKey("https");
        
        // enum property of enum class LogLevel
        // valid values may only be `INFO`, `WARN` or `ERROR`
        this.logLevel = new ConfEagerProperties.Enum(LogLevel);
        
        // complex property
        this.nestedConfiguration = new NestedConfiguration();
        
        // number array property
        this.arrayConfiguration = new ConfEagerProperties.NumberArray();
        
        // all other properties are required and their absence
        // from the source will cause an error on init,
        // this property is optional and when absent will be
        // populated with the value "value"
        this.optionalProperty = new ConfEagerProperties.String().withDefaultValue("value");
    }
}

class NestedConfiguration extends ConfEager {
    
    constructor() {
        super();
        this.nestedProperty = new ConfEagerProperties.Number();
    }
    
}

// load config data from a yaml file with a watch interval of
// 10 milliseconds, when source update is detected,
// all the in-memory properties are immediately updated too.
const source = new ConfEagerSources.YamlFile("config.yaml", 10);

const conf = new Configuration();

// populate data from the source to the configuration instance
// and bind for updates
source.bind(conf);

// that's it, let's use it!
conf.host.get();                                                    // => "0.0.0.0"
conf.port.get();                                                     // => 8080
conf.useHttps.get();                                             // => false
conf.logLevel.get();                                              // => LogLevel.INFO
conf.nestedConfiguration.nestedProperty.get();  // => 1234
conf.arrayConfiguration.get();                              // => [1234, 2345]
conf.optionalProperty.get();                                 // => "value"
```
Or a consumer writtem in TypeScript:

```typescript
import {ConfEager, ConfEagerProperties, ConfEagerSources} from "confeager";

enum LogLevel {
    INFO, WARN, ERROR
}

class Configuration extends ConfEager{

    // string property
    readonly host = new ConfEagerProperties.String();

    // number property
    readonly port = new ConfEagerProperties.Number();

    // boolean property with an explicit key,
    // note that the class property is called `useHttps`,
    // but the config property is called `https`
    readonly useHttps = new ConfEagerProperties.Boolean().withPropertyKey("https");

    // enum property of enum class LogLevel
    // valid values may only be `INFO`, `WARN` or `ERROR`
    readonly logLevel = new ConfEagerProperties.Enum(LogLevel);

    // complex property
    readonly nestedConfiguration = new NestedConfiguration();

    // number array property
    readonly arrayConfiguration = new ConfEagerProperties.NumberArray();

    // all other properties are required and their absence
    // from the source will cause an error on init,
    // this property is optional and when absent will be
    // populated with the value "value"
    readonly optionalProperty = new ConfEagerProperties.String().withDefaultValue("value");

}

class NestedConfiguration extends ConfEager {

    readonly nestedProperty = new ConfEagerProperties.Number();

}

// load config data from a yaml file with a watch interval of
// 10 milliseconds, when source update is detected,
// all the in-memory properties are immediately updated too.
const source = new ConfEagerSources.YamlFile("config.yaml", 10);

const conf = new Configuration();

// populate data from the source to the configuration instance
// and bind for updates
source.bind(conf);

// that's it, let's use it!
conf.host.get();                                                    // => "0.0.0.0"
conf.port.get();                                                     // => 8080
conf.useHttps.get();                                             // => false
conf.logLevel.get();                                              // => LogLevel.INFO
conf.nestedConfiguration.nestedProperty.get();  // => 1234
conf.arrayConfiguration.get();                              // => [1234, 2345]
conf.optionalProperty.get();                                 // => "value"
```

Full documentation can be found on the project [WIKI on GitHub](https://github.com/avivcarmis/conf-eager-js/wiki "WIKI on GitHub").

## Why?
ConfEagerJS is designed with two main charachteristics: being eager and being strongly-typed. This is a very powerful combination that provides a few main advantages.

As opposed to popular configuration libraries ConfEagerJS provides you with an interface for declaring your exact expectations from the configuration data. In addition, properties are eagerly loaded and validated. This combination renders a system that validates your entire configuration data source at boot time. The existance and value validity of each property in the source is validated immidiately. This also means no need to check for `null` and no null pointer errors either. This means no more typos when reading from the configuration, and most importantly, this means that to discover these kind of bugs you do not have to discover the exact control flow that triggers it, but rather let ConfEager find it for you when it loads.

Additionally, ConfEagerJS is aimed to provide simple means to easily implement any data source you like, seamlessly get data updates from it without the need to restart your application, and consume any property type you would like from it.

ConfEagerJS follows a [big sister project for Java](https://github.com/avivcarmis/conf-eager "big sister project for Java").

## Useful Links
- [The project GitHub page](https://github.com/avivcarmis/conf-eager-js "The project GitHub page")
- [The project Issue Tracker on GitHub](https://github.com/avivcarmis/conf-eager-js/issues "The project Issue Tracker on GitHub")
- [The project build Status at Travis CI](https://travis-ci.org/avivcarmis/conf-eager-js "The project build Status at Travis CI")

## License
Go-To-Guy is registered under <a href=/LICENSE.txt target="_blank">MIT</a> license.

## Contribution
Really, any kind of contribution will be warmly accepted. (: