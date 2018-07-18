'use-strict';

/**
 * Fake DB for drones
 */
const drones = {};

const getDrones = () => {
  return Promise.resolve(drones);
};

const getDroneById = id => Promise.resolve(drones[id]);

const updateDrone = (id, data) => {
  drones[id] = data;
  return Promise.resolve({ id, ...data });
};

module.exports = {
  getDrones,
  getDroneById,
  updateDrone,
};