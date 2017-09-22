import "mocha";
import {expect} from "chai";
import {ConfEager} from "../src/ConfEager";
import {ConfEagerProperties} from "../src/ConfEagerProperties";
import {ConfEagerSources} from "../src/ConfEagerSources";
import {ConfEagerSource} from "../src/ConfEagerSource";
import {ConfEagerErrors} from "../src/ConfEagerErrors";
import * as fs from "fs";
import * as yaml from "yamljs";
import EnvironmentVariables = ConfEagerSources.EnvironmentVariables;
import Combinator = ConfEagerSources.Combinator;
import JsonFile = ConfEagerSources.JsonFile;
import YamlFile = ConfEagerSources.YamlFile;
import PropertiesFile = ConfEagerSources.PropertiesFile;
import MissingPropertiesError = ConfEagerErrors.MissingPropertiesError;

describe("Test out-of-the-box sources", () => {

    describe("Test file sources", () => {

        const TEST_FILE_NAME = "temp";

        function writeFile(value: string) {
            fs.writeFileSync(TEST_FILE_NAME, value);
        }

        function cleanFile() {
            fs.unlinkSync(TEST_FILE_NAME);
        }

        describe("Test JSON file source", () => {

            it('Test JSON file success', () => {

                class Conf extends ConfEager {

                    readonly property = new ConfEagerProperties.Boolean();

                }

                writeFile(JSON.stringify({"property": true}));
                const source = new JsonFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                source.bind(conf);
                expect(conf.property.get()).to.equal(true);
                cleanFile();

            });

            it('Test JSON file failure', () => {

                class Conf extends ConfEager {

                    // noinspection JSUnusedGlobalSymbols
                    readonly missingProperty = new ConfEagerProperties.Boolean();

                }

                writeFile("{}");
                const source = new JsonFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                expect(() => source.bind(conf)).to.throw(MissingPropertiesError);
                cleanFile();

            });

        });

        describe("Test YAML file source", () => {

            it('Test YAML file success', () => {

                class Conf extends ConfEager {

                    readonly property = new ConfEagerProperties.Boolean();

                }

                writeFile(yaml.stringify({"property": true}));
                const source = new YamlFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                source.bind(conf);
                expect(conf.property.get()).to.equal(true);
                cleanFile();

            });

            it('Test YAML file failure', () => {

                class Conf extends ConfEager {

                    // noinspection JSUnusedGlobalSymbols
                    readonly missingProperty = new ConfEagerProperties.Boolean();

                }

                writeFile(yaml.stringify({}));
                const source = new YamlFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                expect(() => source.bind(conf)).to.throw(MissingPropertiesError);
                cleanFile();

            });

        });

        describe("Test properties file source", () => {

            it('Test properties file success', () => {

                class Conf extends ConfEager {

                    readonly property = new ConfEagerProperties.Boolean();

                }

                writeFile("property = true");
                const source = new PropertiesFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                source.bind(conf);
                expect(conf.property.get()).to.equal(true);
                cleanFile();

            });

            it('Test properties file failure', () => {

                class Conf extends ConfEager {

                    // noinspection JSUnusedGlobalSymbols
                    readonly missingProperty = new ConfEagerProperties.Boolean();

                }

                writeFile("");
                const source = new PropertiesFile(TEST_FILE_NAME, 0);
                const conf = new Conf();
                expect(() => source.bind(conf)).to.throw(MissingPropertiesError);
                cleanFile();

            });

        });

        it('Test file watch', done => {

            class Conf extends ConfEager {

                readonly property = new ConfEagerProperties.Boolean();

            }

            writeFile(JSON.stringify({"property": true}));
            const source = new JsonFile(TEST_FILE_NAME, 1);
            const conf = new Conf();
            source.bind(conf);
            expect(conf.property.get()).to.equal(true);
            source.onUpdate(() => {
                expect(conf.property.get()).to.equal(false);
                source.close();
                cleanFile();
                done();
            });
            writeFile(JSON.stringify({"property": false}));

        });

    });

    describe("Test environment variables", () => {

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

                // noinspection JSUnusedGlobalSymbols
                readonly property = new ConfEagerProperties.Boolean();

            }

            delete process.env["property"]; // in any case...
            const source = new EnvironmentVariables();
            const conf = new Conf();
            expect(() => source.bind(conf)).to.throw(MissingPropertiesError);

        });

    });

    it('Test source combinator', () => {

        let visitedEmptySource = false;

        class EmptySource extends ConfEagerSource {

            // noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic,JSUnusedGlobalSymbols
            protected get(_path: string[]): string | null | undefined {
                visitedEmptySource = true;
                return null;
            }

        }

        class NonEmptySource extends ConfEagerSource {

            // noinspection JSUnusedLocalSymbols,JSMethodCanBeStatic,JSUnusedGlobalSymbols
            protected get(_path: string[]): string | null | undefined {
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