/// <reference types="node" />
import { Socket } from "dgram";
export declare class Tello {
    host: string;
    port: number;
    client: Socket;
    drone: Socket;
    constructor(host?: string, port?: number);
    listen(): Promise<void>;
    parseState(state: string): any;
    send(command: string): Promise<void>;
    commandMode(): void;
    takeoff(): void;
    land(): void;
    up(distance?: number): void;
    down(distance?: number): void;
    left(distance?: number): void;
    right(distance?: number): void;
    forward(distance?: number): void;
    back(distance?: number): void;
    cw(degrees?: number): void;
    ccw(degrees?: number): void;
    flip(direction: "l" | "r" | "f" | "b"): void;
    go(x: number, y: number, z: number, speed: number, mid?: string): void;
    curve(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, speed: number): void;
    setSpeed(speed?: number): void;
    emergency(): void;
    mon(): void;
    moff(): void;
    missionPad(detect: boolean): void;
    wifiPass(ssid: string, password: string): void;
    close(): void;
}
