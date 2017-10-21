import "mocha";
import {expect} from "chai";
import * as fs from "fs";
import * as yaml from "yamljs";
import {ConfEagerSources} from "../src/ConfEagerSource";
import {exposed} from "smoke-screen";
import EnvironmentVariables = ConfEagerSources.EnvironmentVariables;
import Combinator = ConfEagerSources.Combinator;
import JsonFile = ConfEagerSources.JsonFile;
import YamlFile = ConfEagerSources.YamlFile;
import PropertiesFile = ConfEagerSources.PropertiesFile;
import StubSource = ConfEagerSources.StubSource;

describe("Test out-of-the-box sources", () => {

    class Conf {

        @exposed
        readonly property: string;

    }

    describe("Test file sources", () => {

        const TEST_FILE_NAME = "temp";

        function writeFile(value: string) {
            fs.writeFileSync(TEST_FILE_NAME, value);
        }

        function cleanFile() {
            fs.unlinkSync(TEST_FILE_NAME);
        }

        describe("Test JSON file source", () => {

            it("Test JSON file success", () => {

                writeFile(JSON.stringify({property: "json value"}));
                const source = new JsonFile(TEST_FILE_NAME, 0);
                const conf = source.create(Conf);
                expect(conf.property).to.equal("json value");
                source.close();
                cleanFile();

            });

            it("Test JSON file failure", () => {

                writeFile(JSON.stringify({}));
                const source = new JsonFile(TEST_FILE_NAME, 0);
                expect(() => source.create(Conf)).to.throw(Error);
                source.close();
                cleanFile();

            });

        });

        describe("Test YAML file source", () => {

            it("Test YAML file success", () => {

                writeFile(yaml.stringify({property: "yaml value"}));
                const source = new YamlFile(TEST_FILE_NAME, 0);
                const conf = source.create(Conf);
                expect(conf.property).to.equal("yaml value");
                source.close();
                cleanFile();

            });

            it("Test YAML file failure", () => {

                writeFile(yaml.stringify({}));
                const source = new YamlFile(TEST_FILE_NAME, 0);
                expect(() => source.create(Conf)).to.throw(Error);
                source.close();
                cleanFile();

            });

        });

        describe("Test properties file source", () => {

            it("Test properties file success", () => {

                writeFile("property = props value");
                const source = new PropertiesFile(TEST_FILE_NAME, 0);
                const conf = source.create(Conf);
                expect(conf.property).to.equal("props value");
                source.close();
                cleanFile();

            });

            it("Test properties file failure", () => {

                writeFile("");
                const source = new PropertiesFile(TEST_FILE_NAME, 0);
                expect(() => source.create(Conf)).to.throw(Error);
                source.close();
                cleanFile();

            });

        });

    });

    describe("Test environment variables", () => {

        it("Test environment variable success", () => {

            process.env.property = "env value";
            const source = new EnvironmentVariables();
            const conf = source.create(Conf);
            expect(conf.property).to.equal("env value");

        });

        it("Test environment variable failure", () => {

            delete process.env.property; // in any case...
            const source = new EnvironmentVariables();
            expect(() => source.create(Conf)).to.throw(Error);

        });

    });

    it("Test source combinator", () => {

        const src1 = new StubSource({property: true});
        const src2 = new StubSource({property: false});
        let source = new Combinator(src1, src2);
        let conf = source.create(Conf);
        expect(conf.property).to.equal(true);
        source = new Combinator(src2, src1);
        conf = source.create(Conf);
        expect(conf.property).to.equal(false);

    });

});
