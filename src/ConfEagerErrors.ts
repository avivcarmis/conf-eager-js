import {format} from "util";

export namespace ConfEagerErrors {

    export class IllegalPropertyValueError extends Error {

        constructor(type: string, value: string) {
            super(format("could not parse %s from value `%s`", type, value));
        }

    }

    export class CouldNotParseConfigurationFileError extends Error {

        constructor(filename: string, content: string) {
            super(format("could not parse configuration file %s, with value %s",
                filename, content));
        }

    }

    export class MissingPropertiesError extends Error {

        constructor(properties: string[]) {
            super(format("confEager source missing properties: %s",
                properties.join(", ")));
        }

    }

    export class ReadBeforeWriteError extends Error {

        constructor(property: string) {
            super(format("cannot read configuration property %s before it has been " +
                "populated, bind the configuration instance first.", property));
        }

    }

}