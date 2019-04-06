var assert = require("assert");
var Tello = require("./../dist/app");

describe("Instantiate the Tello object using all types of constructor", function() {
  describe("new Tello()", function() {
    it("should set the public properties host, port to the default values (from config.json file) and enable the command mode", function() {
      var tello = new Tello();
      assert.equal(tello.host, "192.168.10.1");
      assert.equal(tello.port, 8889);
      assert.equal(tello.inCommandMode, true);
    });
  });
  describe("new Tello('192.168.100.100')", function() {
    it("should set the public property host with the value passed through the constructor but set the other properties with the default values", function() {
      var tello = new Tello("192.168.100.100");
      assert.equal(tello.host, "192.168.100.100");
      assert.equal(tello.port, 8889);
      assert.equal(tello.inCommandMode, true);
    });
  });
  describe("new Tello('192.168.100.100')", function() {
    it("should set the public property port with the value passed through the constructor but set the other properties with the default values", function() {
      var tello = new Tello(3000);
      assert.equal(tello.host, "192.168.10.1");
      assert.equal(tello.port, 3000);
      assert.equal(tello.inCommandMode, true);
    });
  });
  describe("Tello(false)", function() {
    it("should set the public properties host, port to the values passed through the constructor and NOT enable the command mode", function() {
      var tello = new Tello(false);
      assert.equal(tello.host, "192.168.10.1");
      assert.equal(tello.port, 8889);
      assert.equal(tello.inCommandMode, false);
    });
  });
  describe('new Tello("192.168.100.100", 3000)', function() {
    it("should set the public properties host, port to the values passed through the constructor and enable the command mode", function() {
      var tello = new Tello("192.168.100.100", 3000);
      assert.equal(tello.host, "192.168.100.100");
      assert.equal(tello.port, 3000);
      assert.equal(tello.inCommandMode, true);
    });
  });
  describe('new Tello({ host: "192.168.100.100", port: 3000 })', function() {
    it("should set the public properties host, port to the values passed through the constructor and enable the command mode", function() {
      var tello = new Tello({ host: "192.168.100.100", port: 3000 });
      assert.equal(tello.host, "192.168.100.100");
      assert.equal(tello.port, 3000);
      assert.equal(tello.inCommandMode, true);
    });
  });
  describe('Tello({host: "192.168.100.100", port: 3000, inCommandMode: true})', function() {
    it("should set the public properties host, port to the values passed through the constructor and enable the command mode", function() {
      var tello = new Tello({
        host: "192.168.100.100",
        port: 3000,
        inCommandMode: true
      });
      assert.equal(tello.host, "192.168.100.100");
      assert.equal(tello.port, 3000);
      assert.equal(tello.inCommandMode, true);
    });
  });
});
