import "mocha";
import {expect} from "chai";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ReadBeforeWriteError} from "../src/ConfEagerErrors";

class Source extends ConfEagerSource {

    constructor(private readonly map: any) {
        super();
    }

    _get(propertyName: string): string | null {
        return this.map[propertyName];
    }

}

describe("Test binding settings", () => {

    it('Basic test', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new Source({"property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test property filter', () => {

        class Conf extends ConfEager {

            readonly ignored = new ConfEagerProperties.Boolean();

            public defaultPropertyFilter(_key: string): boolean {
                return false;
            }

        }

        const source = new Source({"ignored": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(() => conf.ignored.get()).to.throw(ReadBeforeWriteError);

    });

});