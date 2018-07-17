'use strict';

const WebSocket = require('ws');
const http = require('http');

const config = require('./config');
const logger = require('./logger');
const fleetManager = require('./fleet-manager');
const { authenticate } = require('./auth');

const server = http.createServer((req, res) => {
  /**
   * Add /status route to retrieve the position of All drones
   */
  if (req.url === '/status') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(fleetManager.getDronesPosition()));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not found.');
  }
});

logger.info('Initializing WebSocket Server...');
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
  if (ws.auth.role === 'WebAppClient') {
    fleetManager.removeUpdateListener(ws);
  }
}

wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.auth = authenticate(req);
  if (ws.auth.role === 'WebAppClient') {
    fleetManager.addUpdateListener(ws);
  }

  ws.on('message', function incoming(message) {
    if (!this.auth) {
      return;
    }
    const { id } = this.auth;
    if (!id) {
      return;
    }

    const data = JSON.parse(message);
    fleetManager.updateDronePosition(id, data);
  });

  ws.on('close', function close() {
    onCloseWS(ws);
  });
});

/**
 * Detect broken connections by sendig a ping every 30 seconds
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

logger.info('Starting Server...');

server.listen(config.serverPort, '127.0.0.1', () => {
  logger.info('Server started.');
});
