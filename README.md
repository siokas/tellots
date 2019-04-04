---
description: >-
  TelloTs is an elegant TypeScript library that aims to make your life easier
  while coding your DJI Tello Drone!
---

# TelloTS

## Installation

To install the package just copy and paste the following command in your terminal

```
$ npm i tellots
```

{% hint style="info" %}
 The package contains all the declaration types \(.d.ts\) 
{% endhint %}

## Usage

The package exports a class so at first you have to import and initiate the Object.

```text
import { Tello } from "tellots"

var tello = new Tello();

tello.commandMode(); // Tell drone to go in command mode

tello.takeoff(); // Start flying
```



