import { Socket, createSocket } from "dgram";
import config from "./config.json";
import dgram from "dgram";
import { throttle } from "lodash";
import { sleep } from "./helpers";
import { resolve } from "url";
import { rejects } from "assert";

interface ConstructorParameterOptions {
  host?: string;
  port?: number;
  inCommandMode?: boolean;
}

class Tello {
  host: string;
  port: number;
  inCommandMode!: boolean;

  // Socket to send commands to the drone
  client: Socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  // Socket to read information from the drone
  drone: Socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  /**
   * Assign the 'host', 'port' and in public properties if passed through the constructor and bind the port to the socket.
   *
   * @param host string
   * @param port number
   */
  constructor(host: string, port: number, inCommandMode: boolean);
  constructor(host: string, port: number);
  constructor(host: string);
  constructor(port: number);
  constructor(inCommandMode: boolean);
  constructor(options: ConstructorParameterOptions);
  constructor(optionsOrOther: any, port?: number, inCommandMode?: boolean) {
    this.host = config.address.host;
    this.port = config.address.port;
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
    } else {
      if (typeof optionsOrOther === "number") {
        this.port = optionsOrOther;
      } else if (typeof optionsOrOther === "boolean") {
        this.inCommandMode = optionsOrOther;
      } else if (typeof optionsOrOther === "string") {
        this.host = optionsOrOther;

        if (typeof port !== "undefined") {
          this.port = port;
        }

        if (typeof inCommandMode !== "undefined") {
          this.inCommandMode = inCommandMode;
        }
      }
    }

    // // Enable command mode and start listening the messages from the drone
    if (this.inCommandMode) {
      this.commandMode().then(() => this.listen());
    }
  }

  /**
   * Bind the port to the udp connection and start listening messages from the drone
   */
  async listen() {
    this.drone.bind(8890);

    this.drone.on(
      "message",
      throttle(state => {
        let droneState = this.parseState(state.toString());
        console.log(droneState);
      }, 1000)
    );

    this.client.on("message", message => {
      console.log(message.toString("utf8"));
    });
  }

  /**
   * A simple parser for the tello response
   *
   * @param state string
   */
  parseState(state: string): Array<Number> {
    return state
      .split(";")
      .map(x => x.split(":"))
      .reduce((data: any, [key, value]) => {
        data[key] = value;
        return data;
      }, {});
  }

  /**
   * Send the command in Buffer through the udp4 socket
   *
   * @param command The command to send to the drone
   */
  send(command: string): Error | string {
    var message: Buffer = Buffer.from(command);

    this.client.send(message, 0, message.length, this.port, this.host, err => {
      console.error(err);
      return new Error(
        "An error occured while sending your command to the drone!"
      );
    });

    return "ok";
  }

  /**
   * Enter SDK Mode
   */
  async commandMode(delay = config.delays.command) {
    let state = this.send("command");

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      console.log('command Mode')
      resolve("ok");
    });
  }

  /**
   * Auto takeoff.
   */
  async takeoff(delay = config.delays.takeoff) {
    let state = this.send("takeoff");

    await sleep(delay)

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      console.log('takeoff')
      resolve("ok");
    });

    
  }

  /**
   * Auto landing.
   */
  async land(delay = config.delays.land) {
    let state = this.send("land");

    await sleep(delay);

    

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      console.log('land')
      resolve("ok");
    });
  }

  /**
   * Ascend to 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async up(distance = config.defaults.up, delay = config.delays.up) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("up " + distance);

    console.log('up');

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Descend to 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async down(distance = config.defaults.down, delay = config.delays.down) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("down " + distance);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly left for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async left(distance = config.defaults.left, delay = config.delays.left) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("left " + distance);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly right for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async right(distance = config.defaults.right, delay = config.delays.right) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("right " + distance);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly forward for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async forward(
    distance = config.defaults.forward,
    delay = config.delays.forward
  ) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("forward " + distance);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly backward for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  async back(distance = config.defaults.back, delay = config.delays.back) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    let state = this.send("back " + distance);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Rotate 'x' degrees clockwise.
   *
   * @param degrees between (1 - 360)
   */
  async cw(degrees = config.defaults.cw, delay = config.delays.cw) {
    if (degrees < 1) degrees = 1;
    if (degrees > 3600) degrees = 3600;

    let state = this.send("cw " + degrees);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Rotate 'x' degrees counterclockwise.
   *
   * @param degrees between (1 - 360)
   */
  async ccw(degrees = config.defaults.ccw, delay = config.delays.ccw) {
    if (degrees < 1) degrees = 1;
    if (degrees > 3600) degrees = 3600;

    let state = this.send("ccw " + degrees);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Flip in 'x' direction
   *
   * @param direction 'l', 'r', 'f', 'b'
   */
  async flip(
    direction: "l" | "r" | "f" | "b" = "l",
    delay = config.delays.flip
  ) {
    let state = this.send("flip " + direction);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly to the 'x', 'y' and 'z' coordinates at 'speed' (cm/s) ?of the Mission Pad.
   *
   * ** Note: 'x', 'y' and 'z' values can't be set between -20 and 20 simultaneously.
   *
   * @param x between (-500 - +500)
   * @param y between (-500 - +500)
   * @param z between (-500 - +500)
   * @param speed between (10 - 100) (cm/s)
   * @param mid (optional) m1-m8
   */
  async go(
    x: number,
    y: number,
    z: number,
    speed: number,
    mid?: string,
    delay = config.delays.go
  ) {
    if (x < 20) x = 20;
    if (x > 500) x = 500;
    if (y < 20) y = 20;
    if (y > 500) y = 500;
    if (z < 20) z = 20;
    if (z > 500) z = 500;
    if (speed < 10) speed = 10;
    if (speed > 60) speed = 60;

    let state = this.send("go " + x + " " + y + " " + z + " " + speed);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Fly at a curve according to the two given coordinates as "speed" (cm/s).
   * If the arc radius is not within a range of 0.5 - 10 meters, it will respond an error.
   *
   * ** Note: 'x', 'y' and 'z' values can't be set between -20 and 20 simultaneously.
   *
   * @param x1 should be bettween (-500 - +500)
   * @param y1 should be bettween (-500 - +500)
   * @param z1 should be bettween (-500 - +500)
   * @param x2 should be bettween (-500 - +500)
   * @param y2 should be bettween (-500 - +500)
   * @param z2 should be bettween (-500 - +500)
   * @param speed should be between (10 - 100)
   */
  async curve(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    speed: number,
    delay = config.delays.curve
  ) {
    if (x1 < 20) x1 = 20;
    if (x1 > 500) x1 = 500;
    if (y1 < 20) y1 = 20;
    if (y1 > 500) y1 = 500;
    if (z1 < 20) z1 = 20;
    if (z1 > 500) z1 = 500;
    if (x2 < 20) x2 = 20;
    if (x2 > 500) x2 = 500;
    if (y2 < 20) y2 = 20;
    if (y2 > 500) y2 = 500;
    if (z2 < 20) z2 = 20;
    if (z2 > 500) z2 = 500;
    if (speed < 10) speed = 10;
    if (speed > 60) speed = 60;

    let state = this.send(
      "curve " +
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
        speed
    );

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Set speed to 'x' cm/s
   *
   * @param speed between (10 - 100)
   */
  async setSpeed(
    speed = config.defaults.speed,
    delay = config.delays.setSpeed
  ) {
    if (speed < 10) speed = 10;
    if (speed > 100) speed = 100;

    let state = this.send("speed " + speed);

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Stop motors immedietly.
   */
  async emergency(delay = config.delays.emergency) {
    let state = this.send("emergency");

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Enable mission pad detection (both forward and downward detection)
   */
  async mon(delay = config.delays.command) {
    let state = this.send("mon");

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Disable mission pad detection
   */
  async moff(delay = config.delays.command) {
    let state = this.send("moff");

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }

  /**
   * Just an alias to enable or disable monitor pad
   *
   * @param detect boolean
   */
  async missionPad(detect: boolean) {
    if (detect) {
      this.mon();
    } else {
      this.moff();
    }
  }

  /**
   * Set the wifi password
   *
   * @param ssid string
   * @param password string
   */
  async wifiPass(ssid: string, password: string) {}

  /**
   * Terminate the udp connection
   */
  async close() {
    this.client.close();
  }

  async battery(delay = config.delays.command) {
    let state = this.send("battery?");

    await sleep(delay);

    return new Promise((resolve, reject) => {
      if (state instanceof Error) {
        reject(state);
      }

      resolve("ok");
    });
  }
}

export = Tello;
