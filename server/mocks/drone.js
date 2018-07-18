'use strict';

const uuid = require('uuid/v4');
const WebSocket = require('ws');

const { getRandomInt, getRandomPosFromPoint } = require('../src/utils');

// Time between each update of position sent to the server
const UPDATE_INTERVAL = 1000;

// Country where the Drones are located.
// We will fake their initial position around this point
const GEO_COUNTRY = { lat: 50.850346, lng: 4.351721 }; // Brussels, Belgium

class Drone {
  constructor() {
    this.id = uuid();
    this.connectToServer();
  }

  connectToServer() {
    /**
     * Simulate the connection of the drone at different moment
     */
    const timeOut = getRandomInt(1000, 10000);

    setTimeout(() => {
      this.ws = new WebSocket('ws://127.0.0.1:8080', this.id);
      this.ws.on('open', this.onServerConnect.bind(this));

      this.initUpdateInterval();
    }, timeOut);
  }

  onServerConnect() {
    this.sendData(this.getCurrentPosition());
  }

  sendData(payload) {
    this.ws.send(JSON.stringify(payload));
  }

  initUpdateInterval() {
    setInterval(() => {
      this.sendData(this.getCurrentPosition());
    }, UPDATE_INTERVAL);
  }

  getCurrentPosition() {
    if (!this.currentPos) {
      // The first time we connect the drone is position
      // at a random distance from the center of the country
      this.currentPos = getRandomPosFromPoint(GEO_COUNTRY, 3000, 100000);
    } else {
      this.currentPos = getRandomPosFromPoint(this.currentPos);
    }

    return this.currentPos;
  }
}

module.exports = Drone;
