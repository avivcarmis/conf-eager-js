import "mocha";
import {expect} from "chai";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerErrors} from "../src/ConfEagerErrors";
import {ConfEagerSources} from "../src/ConfEagerSources";
import MissingPropertiesError = ConfEagerErrors.MissingPropertiesError;
import StubSource = ConfEagerSources.StubSource;

describe("Test binding settings", () => {

    it('Test simple binding', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new StubSource({"property": "true"});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test configuration pathKeys', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

            // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
            protected pathKeys(): string[] {
                return ["some", "prefix"];
            }

        }

        const source = new StubSource({"some": {"prefix": {"property": "true"}}});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test missing property', () => {

        class Conf extends ConfEager {

            // noinspection JSUnusedGlobalSymbols
            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new StubSource({});
        const conf = new Conf();
        expect(() => source.bind(conf)).to.throw(MissingPropertiesError);

    });

});