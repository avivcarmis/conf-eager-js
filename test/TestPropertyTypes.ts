import "mocha";
import {expect} from "chai";
import {ConfEagerSources} from "../src/ConfEagerSource";
import {Constructable, exposed, PropertyTypes} from "smoke-screen";
import StubSource = ConfEagerSources.StubSource;

describe("Test properties types", () => {

    function testSuccess(confClass: Constructable<any>, value: any, expected = value) {
        const source = new StubSource({property: value});
        const conf = source.create(confClass);
        expect(conf.property).to.deep.equal(expected);
    }

    function testFailure(confClass: Constructable<any>, value: any) {
        const source = new StubSource({property: value});
        expect(() => source.create(confClass)).to.throw(Error);
    }

    describe("Test boolean property", () => {

        class Conf {

            @exposed({type: PropertyTypes.boolean})
            readonly property: boolean;

        }

        it("Test boolean success", () => testSuccess(Conf, true));

        it("Test boolean failure", () => testFailure(Conf, "value"));

    });

    describe("Test number property", () => {

        class Conf {

            @exposed({type: PropertyTypes.number})
            readonly property: number;

        }

        it("Test number success", () => testSuccess(Conf, 1));

        it("Test number failure", () => testFailure(Conf, "value"));

    });

    describe("Test string property", () => {

        class Conf {

            @exposed({type: PropertyTypes.string})
            readonly property: string;

        }

        it("Test string success", () => testSuccess(Conf, "value"));

        it("Test string failure", () => testFailure(Conf, true));

    });

    describe("Test enum property", () => {

        enum Foo {VALUE1}

        class Conf {

            @exposed({type: PropertyTypes.enumOf(Foo)})
            readonly property: Foo;

        }

        it("Test enum success", () => testSuccess(Conf, "value1", Foo.VALUE1));

        it("Test enum failure", () => testFailure(Conf, 0));

        it("Test enum case sensitive", () => {

            class Conf2 {

                @exposed({type: PropertyTypes.enumOf(Foo, true)})
                readonly property: Foo;

            }

            testFailure(Conf2, "value1");

        });

    });

    describe("Test object property", () => {

        class Foo {

            @exposed({type: PropertyTypes.string})
            nestedProperty: string;

        }

        class Conf {

            @exposed({type: PropertyTypes.objectOf(Foo)})
            readonly property: Foo;

        }

        it("Test object success", () => {

            const foo = new Foo();
            foo.nestedProperty = "value";
            testSuccess(Conf, {nestedProperty: "value"}, foo);

        });

        it("Test object failure", () => testFailure(Conf, 0));

    });

    describe("Test boolean array property", () => {

        class Conf {

            @exposed({type: PropertyTypes.arrayOf(PropertyTypes.boolean)})
            readonly property: boolean[];

        }

        it("Test boolean array success", () => testSuccess(Conf, [true, false]));

        it("Test boolean array empty", () => testSuccess(Conf, []));

        it("Test boolean array type failure", () => testFailure(Conf, true));

        it("Test boolean array item failure", () => testFailure(Conf, [true, 0]));

    });

    describe("Test number array property", () => {

        class Conf {

            @exposed({type: PropertyTypes.arrayOf(PropertyTypes.number)})
            readonly property: number[];

        }

        it("Test number array success", () => testSuccess(Conf, [0, 1.12]));

        it("Test number array empty", () => testSuccess(Conf, []));

        it("Test number array type failure", () => testFailure(Conf, true));

        it("Test number array item failure", () => testFailure(Conf, [0, false]));

    });

    describe("Test string array property", () => {

        class Conf {

            @exposed({type: PropertyTypes.arrayOf(PropertyTypes.string)})
            readonly property: string[];

        }

        it("Test string array success", () => testSuccess(Conf, ["value1", "value2"]));

        it("Test string array empty", () => testSuccess(Conf, []));

        it("Test string array type failure", () => testFailure(Conf, true));

        it("Test string array item failure", () => testFailure(Conf, ["value1", 0]));

    });

    describe("Test enum array property", () => {

        enum Foo {VALUE1, VALUE2}

        class Conf {

            @exposed({type: PropertyTypes.arrayOf(PropertyTypes.enumOf(Foo))})
            readonly property: Foo[];

        }

        it("Test enum array success", () =>
            testSuccess(Conf, ["value1", "VALUE2"], [Foo.VALUE1, Foo.VALUE2]));

        it("Test enum array empty", () => testSuccess(Conf, []));

        it("Test enum array type failure", () => testFailure(Conf, true));

        it("Test enum array item failure", () => testFailure(Conf, ["value1", 0]));

    });

    describe("Test object array property", () => {

        class Foo {

            @exposed({type: PropertyTypes.string})
            nestedProperty: string;

        }

        class Conf {

            @exposed({type: PropertyTypes.arrayOf(PropertyTypes.objectOf(Foo))})
            readonly property: Foo[];

        }

        it("Test object array success", () => {
            const foo1 = new Foo();
            foo1.nestedProperty = "value1";
            const foo2 = new Foo();
            foo2.nestedProperty = "value2";
            testSuccess(
                Conf,
                [{nestedProperty: "value1"}, {nestedProperty: "value2"}],
                [foo1, foo2]
            );
        });

        it("Test object array empty", () => testSuccess(Conf, []));

        it("Test object array type failure", () => testFailure(Conf, true));

        it("Test object array item failure", () => testFailure(Conf, [true]));

    });

});
