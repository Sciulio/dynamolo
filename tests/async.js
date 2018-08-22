var dynamolo = require("../dist");

var expect = require('chai').expect;

const pattern = require("./_common").pattern;
const patternAll = require("./_common").patternAll;
const rootPath = require("./_common").rootPath;
const logError = require("./_common").logError;


describe("Async loading test", function() {
  it("load with base config", async function() {
    const res = await dynamolo.loadAsync(pattern, {
      rootPath
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });
  it("load with base config and catch", async function() {
    const res = await dynamolo.loadAsync(patternAll, {
      rootPath,
      catchSingleExports: true,
      logError
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });

  it("load with 'exportDefault'", async function() {
    const res = await dynamolo.loadAsync(pattern, {
      rootPath,
      exportDefault: true
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });
  it("load with 'exportDefault' and catch", async function() {
    const res = await dynamolo.loadAsync(patternAll, {
      rootPath,
      exportDefault: true,
      catchSingleExports: true,
      logError
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });
  
  it("should load a non empty array", async function() {
    const res = await dynamolo.loadAsync(pattern, {
      rootPath,
      exporter: arg => arg
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });
  it("should load a non empty array and catch", async function() {
    const res = await dynamolo.loadAsync(patternAll, {
      rootPath,
      exporter: arg => arg,
      catchSingleExports: true,
      logError
    });

    expect(res)
    .to.be.instanceof(Array)
    .that.is.not.empty;
  });
});