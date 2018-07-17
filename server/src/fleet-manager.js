'use-strict';

/**
 * The FleetManager is in charge of keeping the position of all the drones
 * and broadcast the position update to the listeners (currently our WebApp)
 */
const { broadcastUpdateInterval } = require('./config');

class FleetManager {
  constructor() {
    /**
     * Keep a hash table of all the drones connected
     */
    this.drones = {};

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

  updateDronePosition(id, data) {
    this.drones[id] = data;
    this.queue[id] = data;
    // console.log(`Drone ${id} position update: ${JSON.stringify(data)}`);
  }

  getDronesPosition() {
    return this.drones;
  }

  broadcastUpdates() {
    if (Object.keys(this.queue).length) {
      this.updateListeners.forEach((_, ws) => {
        ws.send(JSON.stringify({ type: 'DRONES_UPDATE', payload: this.queue }));
      });
      this.queue = {};
    }
  }
}

const fleetManager = new FleetManager();
module.exports = fleetManager;
