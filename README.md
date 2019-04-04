<p align="center"><img src="https://i.imgur.com/QLX5ZyT.png"></p>
<p align="center"><img src="https://travis-ci.org/siokas/tellots.svg?branch=master"></p>

## TelloTS

TelloTs is an elegant __TypeScript__ library that aims to make your life easier while coding your __DJI Tello Drone!__

## Installation

To install the package just copy and paste the following command in your terminal

```
$ npm i tellots
```

## Usage

The package exports a class so at first you have to import and initiate the Object.

```text
import { Tello } from "tellots"

var tello = new Tello();

tello.commandMode(); // Tell drone to go in command mode

tello.takeoff(); // Start flying
```