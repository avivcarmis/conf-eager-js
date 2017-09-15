import "mocha";
import {expect} from "chai";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {IllegalPropertyValueError} from "../src/ConfEagerErrors";

class Source extends ConfEagerSource {

    constructor(private readonly map: any) {
        super();
    }

    _get(propertyName: string): string | null | undefined {
        return this.map[propertyName];
    }

}

describe("Test out-of-the-box properties", () => {

    describe("Test boolean property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Boolean();

        }

        it('Test boolean success', () => {

            const source = new Source({"property": "true"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal(true);

        });

        it('Test boolean failure', () => {

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

    describe("Test boolean array property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.BooleanArray();

        }

        it('Test boolean array success', () => {

            const source = new Source({"property": " true , false "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.deep.equal([true, false]);

        });

        it('Test boolean array empty', () => {

            const source = new Source({"property": " , "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get().length).to.equal(0);

        });

        it('Test boolean array failure', () => {

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

    describe("Test number property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.Number();

        }

        it('Test number success', () => {

            const source = new Source({"property": "15.3"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal(15.3);

        });

        it('Test number failure', () => {

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

    describe("Test number array property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.NumberArray();

        }

        it('Test number array success', () => {

            const source = new Source({"property": " 1 , 5.7 "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.deep.equal([1, 5.7]);

        });

        it('Test number array empty', () => {

            const source = new Source({"property": " , "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get().length).to.equal(0);

        });

        it('Test number array failure', () => {

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

    describe("Test string property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.String();

        }

        it('Test string success', () => {

            const source = new Source({"property": "value"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal("value");

        });

    });

    describe("Test string array property", () => {

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.StringArray();

        }

        it('Test string array success', () => {

            const source = new Source({"property": " 1 , value "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.deep.equal(["1", "value"]);

        });

        it('Test string array empty', () => {

            const source = new Source({"property": " , "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get().length).to.equal(0);

        });

    });

    describe("Test enum property", () => {

        enum Foo {VALUE1}

        it('Test enum success', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.Enum(Foo);

            }

            const source = new Source({"property": "VALUE1"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal(Foo.VALUE1);

        });

        it('Test enum failure', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.Enum(Foo);

            }

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

        it('Test enum case insensitive', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.Enum(Foo);

            }

            const source = new Source({"property": "value1"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal(Foo.VALUE1);

        });

        it('Test enum case sensitive', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.Enum(Foo, true);

            }

            const source = new Source({"property": "value1"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

    describe("Test enum array property", () => {

        enum Foo {VALUE1, VALUE2}

        class Conf extends ConfEager {

            readonly property = new ConfEagerProperties.EnumArray(Foo);

        }

        it('Test enum array success', () => {

            const source = new Source({"property": " VALUE1 , VALUE2 "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.deep.equal([Foo.VALUE1, Foo.VALUE2]);

        });

        it('Test enum array empty', () => {

            const source = new Source({"property": " , "});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get().length).to.equal(0);

        });

        it('Test enum array failure', () => {

            const source = new Source({"property": "illegal value"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

        it('Test enum array case insensitive', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.EnumArray(Foo);

            }

            const source = new Source({"property": "value1,Value2"});
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.deep.equal([Foo.VALUE1, Foo.VALUE2]);

        });

        it('Test enum array case sensitive', () => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.EnumArray(Foo, true);

            }

            const source = new Source({"property": "value1"});
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(IllegalPropertyValueError);

        });

    });

});