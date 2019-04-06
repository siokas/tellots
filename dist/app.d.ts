/// <reference types="node" />
import { Socket } from "dgram";
interface ConstructorParameterOptions {
    host?: string;
    port?: number;
    inCommandMode?: boolean;
}
declare class Tello {
    host: string;
    port: number;
    inCommandMode: boolean;
    client: Socket;
    drone: Socket;
    constructor(host: string, port: number, inCommandMode: boolean);
    constructor(host: string, port: number);
    constructor(host: string);
    constructor(port: number);
    constructor(inCommandMode: boolean);
    constructor(options: ConstructorParameterOptions);
    listen(): Promise<void>;
    parseState(state: string): Array<Number>;
    send(command: string): Error | string;
    commandMode(delay?: number): Promise<{}>;
    takeoff(delay?: number): Promise<{}>;
    land(delay?: number): Promise<{}>;
    up(distance?: number, delay?: number): Promise<{}>;
    down(distance?: number, delay?: number): Promise<{}>;
    left(distance?: number, delay?: number): Promise<{}>;
    right(distance?: number, delay?: number): Promise<{}>;
    forward(distance?: number, delay?: number): Promise<{}>;
    back(distance?: number, delay?: number): Promise<{}>;
    cw(degrees?: number, delay?: number): Promise<{}>;
    ccw(degrees?: number, delay?: number): Promise<{}>;
    flip(direction?: "l" | "r" | "f" | "b", delay?: number): Promise<{}>;
    go(x: number, y: number, z: number, speed: number, mid?: string, delay?: number): Promise<{}>;
    curve(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, speed: number, delay?: number): Promise<{}>;
    setSpeed(speed?: number, delay?: number): Promise<{}>;
    emergency(delay?: number): Promise<{}>;
    mon(delay?: number): Promise<{}>;
    moff(delay?: number): Promise<{}>;
    missionPad(detect: boolean): Promise<void>;
    wifiPass(ssid: string, password: string): Promise<void>;
    close(): Promise<void>;
    battery(delay?: number): Promise<{}>;
}
export = Tello;
