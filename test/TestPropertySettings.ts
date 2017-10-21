import "mocha";
import {expect} from "chai";
import {ConfEagerSources} from "../src/ConfEagerSource";
import {exposed} from "smoke-screen";
import StubSource = ConfEagerSources.StubSource;

describe("Test property settings", () => {

    class DefaultConf {

        @exposed
        readonly property: boolean;

    }

    describe("Test optional property", () => {

        it("Test optional property failure", () => {

            const source = new StubSource({});
            expect(() => source.create(DefaultConf)).to.throw(Error);

        });

        it("Test optional property success", () => {

            class Conf {

                @exposed({defaultValue: true})
                readonly property: boolean;

            }

            const source = new StubSource({});
            const conf = source.create(Conf);
            expect(conf.property).to.equal(true);

        });

    });

    describe("Test property key", () => {

        it("Test property key failure", () => {

            const source = new StubSource({customKey: true});
            expect(() => source.create(DefaultConf)).to.throw(Error);

        });

        it("Test property key success", () => {

            class Conf {

                @exposed({as: "customKey"})
                readonly property: boolean;

            }

            const source = new StubSource({customKey: true});
            const conf = source.create(Conf);
            expect(conf.property).to.equal(true);

        });

    });

    describe("Test nullable property", () => {

        it("Test nullable property failure", () => {

            const source = new StubSource({property: null});
            expect(() => source.create(DefaultConf)).to.throw(Error);

        });

        it("Test nullable property success", () => {

            class Conf {

                @exposed({nullable: true})
                readonly property: boolean;

            }

            const source = new StubSource({property: null});
            const conf = source.create(Conf);
            expect(conf.property).to.equal(null);

        });

    });

    describe("Test property validation", () => {

        class Conf {

            @exposed({
                validator: value => {
                    if (value !== true) {
                        throw new Error("must be true");
                    }
                }
            })
            readonly property: boolean;

        }

        it("Test property validation failure", () => {

            const source = new StubSource({property: false});
            expect(() => source.create(Conf)).to.throw(Error);

        });

        it("Test property validation success", () => {

            const source = new StubSource({property: true});
            const conf = source.create(Conf);
            expect(conf.property).to.equal(true);

        });

    });

});
