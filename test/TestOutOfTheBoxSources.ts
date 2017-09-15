import "mocha";
import {expect} from "chai";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerSources} from "../src/ConfEagerSources";
import EnvironmentVariables = ConfEagerSources.EnvironmentVariables;
import {MissingPropertiesError} from "../src/ConfEagerErrors";
import {ConfEagerSource} from "../src/ConfEagerSource";
import Combinator = ConfEagerSources.Combinator;

describe("Test out-of-the-box sources", () => {

    it('Test environment variable success', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        process.env["property"] = "true";
        const source = new EnvironmentVariables();
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

    it('Test environment variable failure', () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        delete process.env["property"]; // in any case...
        const source = new EnvironmentVariables();
        const conf = new Conf();
        expect(() => source.bind(conf)).to.throw(MissingPropertiesError);

    });

    it('Test source combinator', () => {

        let visitedEmptySource = false;

        class EmptySource extends ConfEagerSource {

            _get(_propertyName: string): string | any | any {
                visitedEmptySource = true;
                return null;
            }

        }

        class NonEmptySource extends ConfEagerSource {

            _get(_propertyName: string): string | any | any {
                expect(visitedEmptySource).to.equal(true);
                return "true";
            }

        }

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        const source = new Combinator(
            new EmptySource(),
            new NonEmptySource()
        );
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(true);

    });

});