'use strict';

const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../', '.env'),
});

module.exports = {
  isDev: process.env.NODE_ENV === 'development',
  dashboardClientID: process.env.DASHBOARD_CLIENT_ID,
  webSocketsServerPort: process.env.WSS_PORT || 8080,
  serverPort: process.env.SERVER_PORT || 3000,
  heartBeatInterval: process.env.HEARTBEAT_INTERVAL || 30000,
  broadcastUpdateInterval: process.env.BROADCAST_UPDATE_INTERVAL || 1000,
};
