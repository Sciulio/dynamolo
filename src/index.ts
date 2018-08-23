import path from 'path';
import fs from 'fs';
import glob from "glob";


export type tLogger = (...args: any[]) => void;

export type tArgsConfig = {
  rootPath?: string;
  exportDefault?: boolean;
  exporter?: <T>(module: any) => T;
  catchSingleExports?: boolean;
  logInfo?: tLogger;
  logError?: tLogger;
};

function getParams<T>(...args: any[]) {
  const pattern = arguments[0];
  let config: tArgsConfig = null as any;
  let cback: (def: T) => void = null as any;

  if (arguments.length == 2) {
    if (typeof arguments[1] == "function") {
      cback = arguments[1];
    } else {
      config = arguments[1];
    }
  } else if (arguments.length == 3) {
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

function validateConfig(config: tArgsConfig) {
  config.rootPath = config.rootPath || "";
  config.exportDefault = config.exportDefault || false;
  config.catchSingleExports = config.catchSingleExports || false;

  return config;
}

function importModule<T>(absFilePath: string, exporter: (arg: any) => T, logInfo: tLogger|undefined) {
  logInfo && logInfo(" - Importing module: ", absFilePath);

  const importedModule = require(absFilePath);
  return exporter(importedModule);
}
function importArgs<T>(matches: string[], config: tArgsConfig): T[] {
  const exporter = config.exportDefault ? config.exporter = arg => arg.default : config.exporter || (arg => arg);

  const absFilePathList = matches
  .map(relFilePath => path.join(config.rootPath as string, relFilePath))
  .filter(absFilePath => fs.statSync(absFilePath).isFile());

  if (config.catchSingleExports) {
    return absFilePathList
    .reduce((accum, absFilePath) => {
      try {
        accum.push(importModule<T>(absFilePath, exporter, config.logInfo));
      } catch (err) {
        config.logError && config.logError(err);
      }

      return accum;
    }, [] as T[]);
  }
  
  return absFilePathList
  .map(absFilePath => {
    return importModule(absFilePath, exporter, config.logInfo);
  });
}

export function load<T>(pattern: string, config?: tArgsConfig): T[];
export function load<T>(pattern: string, cback?: (def: T) => void, config?: tArgsConfig): void;
export function load<T>() {
  const {
    pattern,
    config,
    cback
  } = getParams(...arguments);
  const matches = glob.sync(pattern);

  // validate config
  validateConfig(config);

  const importedModuleList = importArgs<T>(matches, config);
  
  if (cback) {
    importedModuleList.forEach(cback);
  } else {
    return importedModuleList;
  }
}

export async function loadAsync<T>(pattern: string, _config?: tArgsConfig): Promise<T[]> {
  const config: tArgsConfig = _config || {} as any;

  // validate config
  validateConfig(config);

  return new Promise<T[]>((res, rej) => {
    glob(pattern, (err, matches) => {
      if (err) {
        rej(err);
        return null;
      }
      
      const importedModuleList = importArgs<T>(matches, config);
      res(importedModuleList);
    })
  });
}