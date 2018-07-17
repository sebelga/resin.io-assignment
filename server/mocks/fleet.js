'use strict';

const Drone = require('./drone');

const TOTAL_DRONES = 10;

let fleet = [];

const initializeFleet = () => {
  for (let i = 0; i < TOTAL_DRONES; i++) {
    const drone = new Drone();
    fleet.push(drone);
  }
};

module.exports = {
  initializeFleet,
};
