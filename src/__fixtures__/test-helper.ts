import fs from "fs";
import path from "path";
import { DomHandlerOptions } from 'domhandler'
import { GeneratorOptions } from '../index'
import { ParserOptions } from "htmlparser2"

function getCallback(file: TestFile, done: (err?: Error | null) => void) {
  return (err: null | Error, actual?: {} | {}[]) => {
    expect(err).toBeNull();
    if (file.useSnapshot) {
      expect(actual).toMatchSnapshot();
    } else {
      expect(actual).toEqual(file.expected);
    }
    done();
  };
}

interface TestFile {
  name: string;
  options: {
    parser?: ParserOptions;
    generator?: GeneratorOptions;
    handler?: DomHandlerOptions;
  } & Partial<GeneratorOptions>;
  html: string;
  file: string;
  useSnapshot?: boolean;
  expected?: string;
}

export function createSuite(
  name: string,
  getResult: (
    file: TestFile,
    done: (error: Error | null, actual?: string) => void
  ) => void
) {
  describe(name, readDir);

  function readDir() {
    const dir = path.join(__dirname, name);

    fs.readdirSync(dir)
      .filter(file => !file.startsWith(".") && !file.startsWith("_"))
      .map(name => path.join(dir, name))
      .map(require)
      .forEach(runTest);
  }

  function runTest(file: TestFile) {
    test(file.name, done => getResult(file, getCallback(file, done)));
  }
}
