import * as util from "util";

export namespace ConfEagerError {

    export enum Type {

        ILLEGAL_PROPERTY_VALUE_ERROR,

        MISSING_PROPERTIES_ERROR,

        READ_BEFORE_WRITE_ERROR

    }

    export function error(type: Type, format: string, ...params: any[]) {
        const error = new Error(util.format(format, params));
        (error as any).type = type;
    }

    export function is(error: any, type: Type) {
        return error instanceof Error && (error as any).type == type;
    }

}