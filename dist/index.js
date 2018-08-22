"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
function getParams(...args) {
    const pattern = arguments[0];
    let config = null;
    let cback = null;
    if (arguments.length == 2) {
        if (typeof arguments[1] == "function") {
            cback = arguments[1];
        }
        else {
            config = arguments[1];
        }
    }
    else if (arguments.length == 3) {
        cback = arguments[1];
        config = arguments[2];
    }
    config = config || {};
    return {
        pattern,
        config,
        cback
    };
}
function validateConfig(config) {
    config.rootPath = config.rootPath || "";
    config.exportDefault = config.exportDefault || false;
    config.catchSingleExports = config.catchSingleExports || false;
    return config;
}
function importModule(absFilePath, exporter, logInfo) {
    logInfo && logInfo(" - Importing module: ", absFilePath);
    const importedModule = require(absFilePath);
    return exporter(importedModule);
}
function importArgs(matches, config) {
    const exporter = config.exportDefault ? config.exporter = arg => arg.default : config.exporter || (arg => arg);
    const absFilePathList = matches
        .map(relFilePath => path_1.default.join(config.rootPath, relFilePath))
        .filter(absFilePath => fs_1.default.statSync(absFilePath).isFile());
    if (config.catchSingleExports) {
        return absFilePathList
            .reduce((accum, absFilePath) => {
            try {
                accum.push(importModule(absFilePath, exporter, config.logInfo));
            }
            catch (err) {
                config.logError && config.logError(err);
            }
            return accum;
        }, []);
    }
    return absFilePathList
        .map(absFilePath => {
        return importModule(absFilePath, exporter, config.logInfo);
    });
}
function load() {
    const { pattern, config, cback } = getParams(...arguments);
    var matches = glob_1.default.sync(pattern);
    // validate config
    validateConfig(config);
    const importedModuleList = importArgs(matches, config);
    if (cback) {
        importedModuleList.forEach(cback);
    }
    else {
        return importedModuleList;
    }
}
exports.load = load;
function loadAsync(pattern, _config) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = _config || {};
        // validate config
        validateConfig(config);
        return new Promise((res, rej) => {
            glob_1.default(pattern, (err, matches) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(importArgs(matches, config));
            });
        });
    });
}
exports.loadAsync = loadAsync;
//# sourceMappingURL=index.js.map