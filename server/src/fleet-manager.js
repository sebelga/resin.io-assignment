'use-strict';

/**
 * The FleetManager is in charge of keeping the position of all the drones
 * and broadcast the position update to the listeners (currently our WebApp)
 */
const { broadcastUpdateInterval, inactiveDroneInterval } = require('./config');
const { getDistanceBetweenPoints } = require('./utils');

const db = require('./db');

const DRONE_STATUSES = {
  flying: '__flying__',
  stopped: '__stopped__',
};

class FleetManager {
  constructor() {
    /**
     * Keep a reference of all the ws clients
     * where to broadcast drones updates.
     */
    this.updateListeners = new Map();

    /**
     * We keep a queue of all the updates happening
     * between 2 broadcast events.
     */
    this.queue = {};

    setInterval(this.broadcastUpdates.bind(this), broadcastUpdateInterval);
    setInterval(this.checkInactiveDrones.bind(this), inactiveDroneInterval);
  }

  addUpdateListener(ws) {
    this.updateListeners.set(ws, true);
  }

  removeUpdateListener(ws) {
    this.updateListeners.delete(ws);
  }

  async updateDronePosition(id, newPos) {
    const updatedOn = Date.now();
    const drone = await db.getDroneById(id);
    const speed = this.getDroneSpeed(drone, newPos);
    const status = speed
      ? DRONE_STATUSES.flying
      : this.isFlying(drone)
        ? DRONE_STATUSES.flying
        : DRONE_STATUSES.stopped;
    const lastMoveOn = speed ? Date.now() : drone ? drone.lastMoveOn : undefined;

    const data = {
      pos: newPos,
      speed,
      status,
    };

    this.queue[id] = data;

    await db.updateDrone(id, { ...data, updatedOn, lastMoveOn });
  }

  async getDronesStatus() {
    return await db.getDrones();
  }

  /**
   * Broadcast drones update to all registered ws clients
   */
  broadcastUpdates() {
    if (Object.keys(this.queue).length) {
      this.updateListeners.forEach((_, ws) => {
        ws.send(JSON.stringify({ type: 'DRONES_UPDATE', payload: this.queue }));
      });
      this.queue = {};
    }
  }

  /**
   * Check periodically if there are any innactive drones
   */
  async checkInactiveDrones() {
    const drones = await db.getDrones();
    const inactiveDrones = Object.keys(drones)
      .filter(k => !this.isFlying(drones[k]))
      .reduce((acc, k) => {
        acc[k] = { ...drones[k], status: DRONE_STATUSES.stopped };
        return acc;
      }, {});

    if (Object.keys(inactiveDrones).length) {
      this.updateListeners.forEach((_, ws) => {
        ws.send(JSON.stringify({ type: 'DRONES_UPDATE', payload: inactiveDrones }));
      });
    }
  }

  getDroneSpeed(drone, newPos) {
    if (!drone) {
      return 0;
    }
    const { pos: oldPos, updatedOn } = drone;
    const distance = getDistanceBetweenPoints(oldPos, newPos) * 1000;
    const timeElapsed = (Date.now() - updatedOn) / 1000; // time in second elapsed since last update
    return distance / timeElapsed;
  }

  isFlying(drone) {
    if (!drone || !drone.lastMoveOn) {
      return true;
    }
    return Date.now() - drone.lastMoveOn < inactiveDroneInterval;
  }
}

const fleetManager = new FleetManager();
module.exports = fleetManager;
