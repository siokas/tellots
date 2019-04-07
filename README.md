> **in development**

<p align="center"><img src="https://i.imgur.com/QLX5ZyT.png"></p>
<p align="center">
<img src="https://travis-ci.org/siokas/tellots.svg?branch=master">
<img src="https://img.shields.io/badge/license-MIT-blue.svg">
</p>


## TelloTS

TelloTs is an elegant **TypeScript** library that aims to make your life easier while coding your **DJI Tello Drone!**

## Installation

To install the package just copy and paste the following command in your terminal

```
$ npm i tellots
```

## Usage

The package exports a class so at first you have to import and initiate the Object.

```text
import Tello from "tellots"
// or var Tello = require('tellots')

var tello = new Tello();

tello.takeoff(); // Start flying
```

## Credits

<li>
<a href="https://dl-cdn.ryzerobotics.com/downloads/Tello/Tello%20SDK%202.0%20User%20Guide.pdf">Official Tello SDK v2.0</a>
</li>

<li>
<a href="https://github.com/wesbos/javascript-drones/tree/master/backend">wesbos/javascript-drones</a>
</li>

<li>
<a href="https://www.flaticon.com/">FlatIcon</a>
</li>
