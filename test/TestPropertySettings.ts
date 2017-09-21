import "mocha";
import {expect} from "chai";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerErrors} from "../src/ConfEagerErrors";
import {ConfEagerSources} from "../src/ConfEagerSources";
import MissingPropertiesError = ConfEagerErrors.MissingPropertiesError;
import StubSource = ConfEagerSources.StubSource;

describe("Test property settings", () => {

    it('Test default settings', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new StubSource({"property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test default value', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean()
                .withDefaultValue(true);

        }

        const source = new StubSource({});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test custom property key', () => {

        class Conf extends ConfEager {

            readonly property =
                new ConfEagerProperties.Boolean().withPropertyKey("some.key");

        }

        const source = new StubSource({"some.key": "true"});
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

        const source = new StubSource({"property": "true"});
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
        const source1 = new StubSource({});
        const conf1 = new Conf();
        source1.bind(conf1);
        expect(conf1.property.get()).to.equal(true);

        // test property key
        const source2 = new StubSource({"some.key": "false"});
        const conf2 = new Conf();
        source2.bind(conf2);
        expect(conf2.property.get()).to.equal(false);

    });

});