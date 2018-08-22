var dynamolo = require("../dist");

var expect = require('chai').expect;

const pattern = require("./_common").pattern;
const patternAll = require("./_common").patternAll;
const rootPath = require("./_common").rootPath;


describe("Sync loading test", function() {
  describe("load with per import callback", function() {
    it("load with base config", function() {
      dynamolo.load(pattern, (loadedArg) => {
        expect(loadedArg).to.be.not.null;
      }, {
        rootPath
      });
    });

    it("load with 'exportDefault'", function() {
      dynamolo.load(pattern, (loadedArg) => {
        expect(loadedArg).to.be.not.null;
      }, {
        rootPath,
        exportDefault: true
      });
    });
    
    it("load with 'exporter' func", function() {
      dynamolo.load(pattern, (loadedArg) => {
        expect(loadedArg).to.be.not.null;
      }, {
        rootPath,
        exporter: arg => arg
      });
    });
  });

  describe("load with returning array", function() {
    it("should load a non empty array", function() {
      const res = dynamolo.load(pattern, {
        rootPath
      });

      expect(res)
      .to.be.instanceof(Array)
      .that.is.not.empty;
    });
    
    it("should load a non empty array", function() {
      const res = dynamolo.load(pattern, {
        rootPath,
        exportDefault: true
      });

      expect(res)
      .to.be.instanceof(Array)
      .that.is.not.empty;
    });
    
    it("should load a non empty array", function() {
      const res = dynamolo.load(pattern, {
        rootPath,
        exporter: arg => arg
      });

      expect(res)
      .to.be.instanceof(Array)
      .that.is.not.empty;
    });
  });
});