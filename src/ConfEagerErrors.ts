import {format} from "util";

export class IllegalPropertyValueError extends Error {

    constructor(type: string, value: string) {
        super(format("could not parse %s from value `%s`", type, value));
    }

}

export class MissingPropertiesError extends Error {

    constructor(properties: string[]) {
        super(format("confEager object missing properties: %s",
            properties.join(", ")));
    }

}

export class ReadBeforeWriteError extends Error {

    constructor(property: string) {
        super(format("cannot read configuration property %s before it has been " +
            "populated, bind the configuration instance first.", property));
    }

}