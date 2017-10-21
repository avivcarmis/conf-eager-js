import "mocha";
import {expect} from "chai";
import {ConfEagerSources} from "../src/ConfEagerSource";
import {exposed} from "smoke-screen";
import StubSource = ConfEagerSources.StubSource;

describe("Test update behaviour", () => {

    it("Test simple update", () => {

        class Conf {

            @exposed
            readonly property: string;

        }

        const VALUE1 = "VALUE1";
        const VALUE2 = "VALUE2";
        const source = new StubSource({property: VALUE1});
        const conf = new Conf();
        source.bind(conf);
        expect(conf.property).to.equal(VALUE1);
        source.update({property: VALUE2});
        expect(conf.property).to.equal(VALUE2);

    });

});
