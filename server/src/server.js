'use strict';

const WebSocket = require('ws');
const http = require('http');

const config = require('./config');
const logger = require('./logger');
const fleetManager = require('./fleet-manager');
const { authenticate } = require('./auth');

const server = http.createServer(async (req, res) => {
  /**
   * Add "/status" route to be able to know at any moment
   * the position of all drones
   */
  if (req.url === '/status') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    const dronesStatus = await fleetManager.getDronesStatus();
    res.end(JSON.stringify(dronesStatus));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not found.');
  }
});

logger.info(`Starting WebSocket Server on port ${config.webSocketsServerPort}...`);
const wss = new WebSocket.Server({ port: config.webSocketsServerPort, server });

/**
 * Mock a fleet of Drones
 */
if (config.isDev) {
  const { initializeFleet } = require('../mocks/fleet');
  initializeFleet();
}

function heartbeat() {
  this.isAlive = true;
}

function onCloseWS(ws) {
  logger.info(`Lost ws connection: ${ws.auth.id} : ${ws.auth.role}`);

  if (ws.auth.role === 'WebAppClient') {
    /**
     * Remove the ws client from the listeners
     * of drones position updates
     */
    fleetManager.removeUpdateListener(ws);
  }
}

wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.auth = authenticate(req);

  logger.info(`New ws connection: ${ws.auth.id} : ${ws.auth.role}`);

  if (ws.auth.role === 'WebAppClient') {
    /**
     * Add a ws client to the listeners to brodacast
     * the drones position updates
     */
    fleetManager.addUpdateListener(ws);
  }

  ws.on('message', function incoming(message) {
    if (!this.auth || !this.auth.id) {
      return;
    }

    const { id } = this.auth;
    fleetManager.updateDronePosition(id, JSON.parse(message));
  });

  ws.on('close', function close() {
    onCloseWS(ws);
  });
});

/**
 * Detect broken connections by sendig a ping every 30 seconds
 * to each client
 */
setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      onCloseWS(ws);
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(() => {});
  });
}, Number(config.heartBeatInterval));

logger.info(`Starting Server at ${config.serverHost}:${config.serverPort}...`);

server.listen(config.serverPort, config.serverHost, () => {
  logger.info('Server started.');
});
