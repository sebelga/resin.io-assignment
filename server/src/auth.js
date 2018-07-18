'use strict';

const config = require('./config');

/**
 * Authenticate the WebSocket request to determine if
 * it is our WebApp client
 *
 * @param {*} req WebSocket request
 */
const authenticate = req => {
  const id = req.headers['sec-websocket-protocol'];
  const role = id === config.dashboardClientID ? 'WebAppClient' : 'Drone';
  return {
    id,
    role,
  };
};

module.exports = {
  authenticate,
};
