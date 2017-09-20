import "mocha";
import {expect} from "chai";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {MissingPropertiesError} from "../src/ConfEagerErrors";

class Source extends ConfEagerSource {

    constructor(private readonly map: any) {
        super();
    }

    get(propertyName: string): string | null | undefined {
        return this.map[propertyName];
    }

}

describe("Test binding settings", () => {

    it('Test simple binding', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new Source({"property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test configuration prefix', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

            // noinspection JSMethodCanBeStatic
            protected _prefix(): string {
                return "some.prefix.";
            }

        }

        const source = new Source({"some.prefix.property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test missing property', () => {

        class Conf extends ConfEager {

            // noinspection JSUnusedGlobalSymbols
            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new Source({});
        const conf = new Conf();
        expect(() => source.bind(conf)).to.throw(MissingPropertiesError);

    });

});