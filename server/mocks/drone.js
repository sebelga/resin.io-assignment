'use strict';

const uuid = require('uuid/v4');
const WebSocket = require('ws');

const { getRandomInt, getRandomFloat } = require('../src/utils');

// Time between each update of position sent to the server
const UPDATE_INTERVAL = 1000;

// Country where the Drones are
// We will fake their initial position around this point
const GEO_COUNTRY = { lat: 50.850346, lng: 4.351721 }; // Brussels, Belgium

/**
 * Get a new random Geo position at a distance from a point
 *
 * @param {object} geoPoint Point from which to calculate the distance. ex: { lng: 10.123, lat: 22.123 }
 * @param {number} minDistance minimum distance in meter from the point
 * @param {number} maxDistance maximum distance in meter from the point
 */
const getPosFromPoint = (geoPoint, minDistance = 10, maxDistance = 25) => {
  const distLat = getRandomInt(minDistance, maxDistance);
  const distLng = getRandomInt(minDistance, maxDistance);

  // 1km in degree = 1 / 111.32km = 0.0089
  // 1m in degree = 0.0089 / 1000 = 0.0000089
  const coefLat = distLat * 0.0000089;
  const coefLng = distLng * 0.0000089;

  const lat = geoPoint.lat + coefLat;
  // pi / 180 = 0.018
  const lng = geoPoint.lng + coefLng / Math.cos(lat * 0.018);

  return { lat, lng };
};

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
      this.currentPos = getPosFromPoint(GEO_COUNTRY, 3000, 100000);
    } else {
      this.currentPos = getPosFromPoint(this.currentPos);
    }

    return this.currentPos;
  }
}

module.exports = Drone;
