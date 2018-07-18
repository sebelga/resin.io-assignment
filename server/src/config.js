'use strict';

const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: path.join(__dirname, '../', '.env'),
});

module.exports = {
  isDev: process.env.NODE_ENV === 'development',
  dashboardClientID: process.env.DASHBOARD_CLIENT_ID,
  webSocketsServerPort: process.env.WEB_SOCKET_SERVER_PORT || 8080,
  serverHost: process.env.SERVER_HOST || '127.0.0.1',
  serverPort: process.env.SERVER_PORT || 3000,
  heartBeatInterval: process.env.HEARTBEAT_INTERVAL || 30000,
  broadcastUpdateInterval: process.env.BROADCAST_UPDATE_INTERVAL || 1000,
};
