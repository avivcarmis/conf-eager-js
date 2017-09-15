import "mocha";
import {expect} from "chai";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";

describe("Test update behaviour", () => {

    it('Test simple update', () => {

        class Source extends ConfEagerSource {

            constructor(private value: string) {
                super();
            }

            updateValue(value: string): void {
                this.value = value;
                this.notifyUpdate();
            }

            _get(_propertyName: string): string | null | undefined {
                return this.value;
            }

        }

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.String();

        }

        const VALUE1 = "VALUE1";
        const VALUE2 = "VALUE2";
        const source = new Source(VALUE1);
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property.get()).to.equal(VALUE1);
        source.updateValue(VALUE2);
        expect(conf.property.get()).to.equal(VALUE2);

    });

});