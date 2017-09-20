import "mocha";
import {expect} from "chai";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerErrors} from "../src/ConfEagerErrors";
import MissingPropertiesError = ConfEagerErrors.MissingPropertiesError;

class Source extends ConfEagerSource {

    constructor(private readonly map: any) {
        super();
    }

    get(propertyName: string): string | null | undefined {
        return this.map[propertyName];
    }

}

describe("Test property settings", () => {

    it('Test default settings', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new Source({"property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test default value', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean()
                .withDefaultValue(true);

        }

        const source = new Source({});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test custom property key', () => {

        class Conf extends ConfEager {

            readonly property =
                new ConfEagerProperties.Boolean().withPropertyKey("some.key");

        }

        const source = new Source({"some.key": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test property name failure', () => {

        class Conf extends ConfEager {

            // noinspection JSUnusedGlobalSymbols
            readonly property =
                new ConfEagerProperties.Boolean().withPropertyKey("some.key");

        }

        const source = new Source({"property": "true"});
        const conf = new Conf();
        expect(() => source.bind(conf)).to.throw(MissingPropertiesError);

    });

    it('Test combination', () => {

        class Conf extends ConfEager {

            // noinspection JSUnusedGlobalSymbols
            readonly property = new ConfEagerProperties.Boolean()
                .withPropertyKey("some.key")
                .withDefaultValue(true);

        }

        // test default value
        const source1 = new Source({});
        const conf1 = new Conf();
        source1.bind(conf1);
        expect(conf1.property.get()).to.equal(true);

        // test property key
        const source2 = new Source({"some.key": "false"});
        const conf2 = new Conf();
        source2.bind(conf2);
        expect(conf2.property.get()).to.equal(false);

    });

});