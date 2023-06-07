
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    moduleFileExtensions: [ "js", "json", "ts" ],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".e2e-spec.ts$",
    transform: { "^.+\\.(t|j)s$": "ts-jest" },
    forceExit: true,
    detectOpenHandles: true,
    silent: false
}

export default config;
