'use-strict';

/**
 * The FleetManager is in charge of keeping the position of all the drones
 * and broadcast the position update to the listeners (currently our WebApp)
 */
const { broadcastUpdateInterval } = require('./config');
const { getDistanceBetweenPoints } = require('./utils');

const db = require('./db');

class FleetManager {
  constructor() {
    /**
     * Keep a reference of all the ws connection
     * where to broadcast updates
     */
    this.updateListeners = new Map();

    /**
     * We keep a queue of all the updates happening
     * between 2 broadcasts event
     */
    this.queue = {};

    setInterval(this.broadcastUpdates.bind(this), broadcastUpdateInterval);
  }

  addUpdateListener(ws) {
    this.updateListeners.set(ws, true);
  }

  removeUpdateListener(ws) {
    this.updateListeners.delete(ws);
  }

  async updateDronePosition(id, newPos) {
    const speed = await this.calculateDroneSpeed(id, newPos);
    const data = {
      pos: newPos,
      speed,
    };

    this.queue[id] = data;

    await db.updateDrone(id, { ...data, updatedOn: Date.now() });
  }

  async getDronesStatus() {
    return await db.getDrones();
  }

  /**
   * Broadcast drones update to all ws client registered
   */
  broadcastUpdates() {
    if (Object.keys(this.queue).length) {
      this.updateListeners.forEach((_, ws) => {
        ws.send(JSON.stringify({ type: 'DRONES_UPDATE', payload: this.queue }));
      });
      this.queue = {};
    }
  }

  async calculateDroneSpeed(id, newPos) {
    const drone = await db.getDroneById(id);
    if (!drone) {
      return 0;
    }
    const { pos: oldPos, updatedOn } = drone;
    const distance = getDistanceBetweenPoints(oldPos, newPos) * 1000;
    const timeElapsed = (Date.now() - updatedOn) / 1000; // time in second elapsed since last update
    return distance / timeElapsed;
  }
}

const fleetManager = new FleetManager();
module.exports = fleetManager;
