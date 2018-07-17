'use strict';

const uuid = require('uuid/v4');
const WebSocket = require('ws');

const { getRandomInt, getRandomFloat } = require('../src/utils');

const UPDATE_INTERVAL = 1000;

class Drone {
  constructor() {
    this.id = uuid();
    this.connectToServer();
  }

  connectToServer() {
    /**
     * Simulate the connection of the drone at different moment
     */
    const timeOut = getRandomInt(1000, 5000);

    setTimeout(() => {
      this.ws = new WebSocket('ws://127.0.0.1:8080', this.id);
      this.ws.on('open', this.onServerConnect.bind(this));
      this.ws.on('message', this.onServerMessage.bind(this));

      this.initUpdateInterval();
    }, timeOut);
  }

  onServerConnect() {
    this.sendData(this.getCurrentPosition());
  }

  onServerMessage(data) {
    console.log(`Message from server: ${data}`);
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
    return {
      lat: getRandomFloat(-180, 180, 3),
      lng: getRandomFloat(-180, 180, 3),
    };
  }
}

module.exports = Drone;
