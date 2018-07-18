'use strict';

/**
 * Drone instance to simulate real moving clients around
 * a Country
 */

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
    this.status = '__flying__';
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
      this.status = this.getStatus();
      if (this.status === '__flying__') {
        this.currentPos = getRandomPosFromPoint(this.currentPos);
      }
    }

    return this.currentPos;
  }

  getStatus() {
    let status = this.status;
    if (this.status === '__flying__') {
      // We simulate randomly a Drone that stops flying
      const rand = getRandomInt(1, 50);
      if (rand === 7) {
        status = '__stopped__';
        this.timeStoppedFlying = Date.now();
      }
    } else if (status === '__stopped__' && this.timeStoppedFlying && Date.now() - this.timeStoppedFlying > 12000) {
      status = '__flying__';
    }
    return status;
  }
}

module.exports = Drone;
