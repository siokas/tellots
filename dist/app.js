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
var config_json_1 = __importDefault(require("./config.json"));
var dgram_1 = __importDefault(require("dgram"));
var lodash_1 = require("lodash");
var helpers_1 = require("./helpers");
var Tello = (function () {
    function Tello(optionsOrOther, port, inCommandMode) {
        var _this = this;
        this.client = dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
        this.drone = dgram_1.default.createSocket({ type: "udp4", reuseAddr: true });
        this.host = config_json_1.default.address.host;
        this.port = config_json_1.default.address.port;
        this.inCommandMode = true;
        if (typeof optionsOrOther === "object") {
            if (optionsOrOther.hasOwnProperty("host")) {
                this.host = optionsOrOther.host;
            }
            if (optionsOrOther.hasOwnProperty("port")) {
                this.port = optionsOrOther.port;
            }
            if (optionsOrOther.hasOwnProperty("inCommandMode")) {
                this.inCommandMode = optionsOrOther.inCommandMode;
            }
        }
        else {
            if (typeof optionsOrOther === "number") {
                this.port = optionsOrOther;
            }
            else if (typeof optionsOrOther === "boolean") {
                this.inCommandMode = optionsOrOther;
            }
            else if (typeof optionsOrOther === "string") {
                this.host = optionsOrOther;
                if (typeof port !== "undefined") {
                    this.port = port;
                }
                if (typeof inCommandMode !== "undefined") {
                    this.inCommandMode = inCommandMode;
                }
            }
        }
        if (this.inCommandMode) {
            this.commandMode().then(function () { return _this.listen(); });
        }
    }
    Tello.prototype.listen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.drone.bind(8890);
                this.drone.on("message", lodash_1.throttle(function (state) {
                    var droneState = _this.parseState(state.toString());
                    console.log(droneState);
                }, 1000));
                this.client.on("message", function (message) {
                    console.log(message.toString("utf8"));
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
        var message = Buffer.from(command);
        this.client.send(message, 0, message.length, this.port, this.host, function (err) {
            console.error(err);
            return new Error("An error occured while sending your command to the drone!");
        });
        return "ok";
    };
    Tello.prototype.commandMode = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.command; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("command");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                console.log('command Mode');
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.takeoff = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.takeoff; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("takeoff");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                console.log('takeoff');
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.land = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.land; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("land");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                console.log('land');
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.up = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.up; }
        if (delay === void 0) { delay = config_json_1.default.delays.up; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("up " + distance);
                        console.log('up');
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.down = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.down; }
        if (delay === void 0) { delay = config_json_1.default.delays.down; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("down " + distance);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.left = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.left; }
        if (delay === void 0) { delay = config_json_1.default.delays.left; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("left " + distance);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.right = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.right; }
        if (delay === void 0) { delay = config_json_1.default.delays.right; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("right " + distance);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.forward = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.forward; }
        if (delay === void 0) { delay = config_json_1.default.delays.forward; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("forward " + distance);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.back = function (distance, delay) {
        if (distance === void 0) { distance = config_json_1.default.defaults.back; }
        if (delay === void 0) { delay = config_json_1.default.delays.back; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (distance < 20)
                            distance = 20;
                        if (distance > 500)
                            distance = 500;
                        state = this.send("back " + distance);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.cw = function (degrees, delay) {
        if (degrees === void 0) { degrees = config_json_1.default.defaults.cw; }
        if (delay === void 0) { delay = config_json_1.default.delays.cw; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (degrees < 1)
                            degrees = 1;
                        if (degrees > 3600)
                            degrees = 3600;
                        state = this.send("cw " + degrees);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.ccw = function (degrees, delay) {
        if (degrees === void 0) { degrees = config_json_1.default.defaults.ccw; }
        if (delay === void 0) { delay = config_json_1.default.delays.ccw; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (degrees < 1)
                            degrees = 1;
                        if (degrees > 3600)
                            degrees = 3600;
                        state = this.send("ccw " + degrees);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.flip = function (direction, delay) {
        if (direction === void 0) { direction = "l"; }
        if (delay === void 0) { delay = config_json_1.default.delays.flip; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("flip " + direction);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.go = function (x, y, z, speed, mid, delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.go; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        state = this.send("go " + x + " " + y + " " + z + " " + speed);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.curve = function (x1, y1, z1, x2, y2, z2, speed, delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.curve; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
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
                        state = this.send("curve " +
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
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.setSpeed = function (speed, delay) {
        if (speed === void 0) { speed = config_json_1.default.defaults.speed; }
        if (delay === void 0) { delay = config_json_1.default.delays.setSpeed; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (speed < 10)
                            speed = 10;
                        if (speed > 100)
                            speed = 100;
                        state = this.send("speed " + speed);
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.emergency = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.emergency; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("emergency");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.mon = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.command; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("mon");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.moff = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.command; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("moff");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    Tello.prototype.missionPad = function (detect) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (detect) {
                    this.mon();
                }
                else {
                    this.moff();
                }
                return [2];
            });
        });
    };
    Tello.prototype.wifiPass = function (ssid, password) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2];
        }); });
    };
    Tello.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.client.close();
                return [2];
            });
        });
    };
    Tello.prototype.battery = function (delay) {
        if (delay === void 0) { delay = config_json_1.default.delays.command; }
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = this.send("battery?");
                        return [4, helpers_1.sleep(delay)];
                    case 1:
                        _a.sent();
                        return [2, new Promise(function (resolve, reject) {
                                if (state instanceof Error) {
                                    reject(state);
                                }
                                resolve("ok");
                            })];
                }
            });
        });
    };
    return Tello;
}());
module.exports = Tello;
