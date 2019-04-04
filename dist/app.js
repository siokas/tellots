"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = __importDefault(require("./config.json"));
var dgram_1 = __importDefault(require("dgram"));
var lodash_1 = require("lodash");
var Tello = (function () {
    function Tello(host, port) {
        if (host === void 0) { host = config_json_1.default.address.host; }
        if (port === void 0) { port = config_json_1.default.address.port; }
        this.client = dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
        this.drone = dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
        this.client.bind(port);
        this.host = host;
        this.port = port;
    }
    Tello.prototype.listen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.drone.bind(8890);
                this.drone.on("message", function (message) {
                    lodash_1.throttle(function (state) {
                        _this.parseState(state.toString());
                    }, 1000);
                });
                this.client.on("message", function (message) {
                    console.log(message.toString());
                });
                return [2];
            });
        });
    };
    Tello.prototype.parseState = function (state) {
        return state
            .split(";")
            .map(function (x) { return x.split(":"); })
            .reduce(function (data, _a) {
            var key = _a[0], value = _a[1];
            data[key] = value;
            return data;
        }, {});
    };
    Tello.prototype.send = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                message = Buffer.from(command);
                this.client.send(message, 0, message.length, this.port, this.host, function (err) {
                    console.error(err);
                });
                return [2];
            });
        });
    };
    Tello.prototype.commandMode = function () {
        this.send("command");
    };
    Tello.prototype.takeoff = function () {
        this.send("takeoff");
    };
    Tello.prototype.land = function () {
        this.send("land");
    };
    Tello.prototype.up = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.up; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("up " + distance);
    };
    Tello.prototype.down = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.down; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("down " + distance);
    };
    Tello.prototype.left = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.left; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("left " + distance);
    };
    Tello.prototype.right = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.right; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("right " + distance);
    };
    Tello.prototype.forward = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.forward; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("forward " + distance);
    };
    Tello.prototype.back = function (distance) {
        if (distance === void 0) { distance = config_json_1.default.defaults.back; }
        if (distance < 20)
            distance = 20;
        if (distance > 500)
            distance = 500;
        this.send("back " + distance);
    };
    Tello.prototype.cw = function (degrees) {
        if (degrees === void 0) { degrees = config_json_1.default.defaults.cw; }
        if (degrees < 1)
            degrees = 1;
        if (degrees > 3600)
            degrees = 3600;
        this.send("cw " + degrees);
    };
    Tello.prototype.ccw = function (degrees) {
        if (degrees === void 0) { degrees = config_json_1.default.defaults.ccw; }
        if (degrees < 1)
            degrees = 1;
        if (degrees > 3600)
            degrees = 3600;
        this.send("ccw " + degrees);
    };
    Tello.prototype.flip = function (direction) {
        this.send("flip " + direction);
    };
    Tello.prototype.go = function (x, y, z, speed, mid) {
        if (x < 20)
            x = 20;
        if (x > 500)
            x = 500;
        if (y < 20)
            y = 20;
        if (y > 500)
            y = 500;
        if (z < 20)
            z = 20;
        if (z > 500)
            z = 500;
        if (speed < 10)
            speed = 10;
        if (speed > 60)
            speed = 60;
        this.send("go " + x + " " + y + " " + z + " " + speed);
    };
    Tello.prototype.curve = function (x1, y1, z1, x2, y2, z2, speed) {
        if (x1 < 20)
            x1 = 20;
        if (x1 > 500)
            x1 = 500;
        if (y1 < 20)
            y1 = 20;
        if (y1 > 500)
            y1 = 500;
        if (z1 < 20)
            z1 = 20;
        if (z1 > 500)
            z1 = 500;
        if (x2 < 20)
            x2 = 20;
        if (x2 > 500)
            x2 = 500;
        if (y2 < 20)
            y2 = 20;
        if (y2 > 500)
            y2 = 500;
        if (z2 < 20)
            z2 = 20;
        if (z2 > 500)
            z2 = 500;
        if (speed < 10)
            speed = 10;
        if (speed > 60)
            speed = 60;
        this.send("curve " +
            x1 +
            " " +
            y1 +
            " " +
            z1 +
            " " +
            x2 +
            " " +
            y2 +
            " " +
            z2 +
            " " +
            speed);
    };
    Tello.prototype.setSpeed = function (speed) {
        if (speed === void 0) { speed = config_json_1.default.defaults.speed; }
        if (speed < 10)
            speed = 10;
        if (speed > 100)
            speed = 100;
        this.send("speed " + speed);
    };
    Tello.prototype.emergency = function () {
        this.send("emergency");
    };
    Tello.prototype.mon = function () {
        this.send("mon");
    };
    Tello.prototype.moff = function () {
        this.send("moff");
    };
    Tello.prototype.missionPad = function (detect) {
        if (detect) {
            this.mon();
        }
        else {
            this.moff();
        }
    };
    Tello.prototype.wifiPass = function (ssid, password) { };
    Tello.prototype.close = function () {
        this.client.close();
    };
    return Tello;
}());
exports.Tello = Tello;
