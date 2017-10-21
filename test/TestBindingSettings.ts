import "mocha";
import {expect} from "chai";
import {ConfEagerSources} from "../src/ConfEagerSource";
import {exposed} from "smoke-screen";
import StubSource = ConfEagerSources.StubSource;

describe("Test binding settings", () => {

    class Conf {

        @exposed
        readonly property: boolean;

    }

    it("Test simple binding", () => {

        const source = new StubSource({property: true});
        const conf = source.create(Conf);
        expect(conf.property).to.equal(true);

    });

    it("Test missing property", () => {

        const source = new StubSource({});
        expect(() => source.create(Conf)).to.throw(Error);

    });

});
