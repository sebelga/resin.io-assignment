'use strict';

const config = require('./config');

/**
 * Authenticate the WebSocket request to determine if
 * it is our WebApp client
 *
 * @param {*} req WebSocket request
 */
const authenticate = req => {
  const { cookie } = req.headers;
  if (cookie) {
    const id = cookie.split('=')[1];
    if (id === config.dashboardClientID) {
      return {
        id,
        role: 'WebAppClient',
      };
    }
  }

  const id = req.headers['sec-websocket-protocol'];
  return {
    id,
  };
};

module.exports = {
  authenticate,
};
