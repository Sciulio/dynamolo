module.exports.rootPath = process.cwd();
module.exports.pattern = "./node_modules/minimist/index.js";
module.exports.patternAll = "./node_modules/**/index.js";

module.exports.logError = (...args) => console.log("\x1b[41m", " - LOGERROR", ...(args).map(a => a.message || a), "\x1b[40m");