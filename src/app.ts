import { Socket, createSocket } from "dgram";
import config from "./config.json";
import dgram from "dgram";
import { throttle } from "lodash";

export class Tello {
  host: string;
  port: number;

  // Socket to send commands to the drone
  client: Socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  // Socket to read information from the drone
  drone: Socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  /**
   * Assign the 'host' and the 'port' public properties if passed through the constructor and bind the port to the socket.
   * 
   * @param host string
   * @param port number
   */
  constructor(host = config.address.host, port = config.address.port) {
    this.client.bind(port);

    this.host = host;
    this.port = port;
  }

  /**
   * Bind the port to the udp connection and start listening messages from the drone
   */
  async listen() {
    this.drone.bind(8890);

    this.drone.on("message", message => {
      throttle(state => {
        this.parseState(state.toString());
      }, 1000);
    });

    this.client.on("message", message => {
      console.log(message.toString());
    });
  }

  /**
   * A simple parser for the tello response
   *
   * @param state string
   */
  parseState(state: string) {
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
  async send(command: string) {
    var message: Buffer = Buffer.from(command);

    this.client.send(message, 0, message.length, this.port, this.host, err => {
      console.error(err);
    });
  }

  /**
   * Enter SDK Mode
   */
  commandMode() {
    this.send("command");
  }

  /**
   * Auto takeoff.
   */
  takeoff() {
    this.send("takeoff");
  }

  /**
   * Auto landing.
   */
  land() {
    this.send("land");
  }

  /**
   * Ascend to 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  up(distance = config.defaults.up) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("up " + distance);
  }

  /**
   * Descend to 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  down(distance = config.defaults.down) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("down " + distance);
  }

  /**
   * Fly left for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  left(distance = config.defaults.left) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("left " + distance);
  }

  /**
   * Fly right for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  right(distance = config.defaults.right) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("right " + distance);
  }

  /**
   * Fly forward for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  forward(distance = config.defaults.forward) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("forward " + distance);
  }

  /**
   * Fly backward for 'x' cm.
   *
   * @param distance between (20 - 500)
   */
  back(distance = config.defaults.back) {
    if (distance < 20) distance = 20;
    if (distance > 500) distance = 500;

    this.send("back " + distance);
  }

  /**
   * Rotate 'x' degrees clockwise.
   *
   * @param degrees between (1 - 360)
   */
  cw(degrees = config.defaults.cw) {
    if (degrees < 1) degrees = 1;
    if (degrees > 3600) degrees = 3600;

    this.send("cw " + degrees);
  }

  /**
   * Rotate 'x' degrees counterclockwise.
   *
   * @param degrees between (1 - 360)
   */
  ccw(degrees = config.defaults.ccw) {
    if (degrees < 1) degrees = 1;
    if (degrees > 3600) degrees = 3600;

    this.send("ccw " + degrees);
  }

  /**
   * Flip in 'x' direction
   *
   * @param direction 'l', 'r', 'f', 'b'
   */
  flip(direction: "l" | "r" | "f" | "b") {
    this.send("flip " + direction);
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
  go(x: number, y: number, z: number, speed: number, mid?: string) {
    if (x < 20) x = 20;
    if (x > 500) x = 500;
    if (y < 20) y = 20;
    if (y > 500) y = 500;
    if (z < 20) z = 20;
    if (z > 500) z = 500;
    if (speed < 10) speed = 10;
    if (speed > 60) speed = 60;

    this.send("go " + x + " " + y + " " + z + " " + speed);
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
  curve(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    speed: number
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

    this.send(
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
  }

  /**
   * Set speed to 'x' cm/s
   *
   * @param speed between (10 - 100)
   */
  setSpeed(speed = config.defaults.speed) {
    if (speed < 10) speed = 10;
    if (speed > 100) speed = 100;

    this.send("speed " + speed);
  }

  /**
   * Stop motors immedietly.
   */
  emergency() {
    this.send("emergency");
  }

  /**
   * Enable mission pad detection (both forward and downward detection)
   */
  mon() {
    this.send("mon");
  }

  /**
   * Disable mission pad detection
   */
  moff() {
    this.send("moff");
  }

  /**
   * Just an alias to enable or disable monitor pad
   *
   * @param detect boolean
   */
  missionPad(detect: boolean) {
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
  wifiPass(ssid: string, password: string) {}

  /**
   * Terminate the udp connection
   */
  close() {
    this.client.close();
  }
}