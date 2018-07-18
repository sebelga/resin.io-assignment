# BlueInc Drones Web Application

This application tracks the position in real time of BlueInc drones accross Belgium.

## Client

In the client folder there is a React single page application that connects to the Websocket server and identify itself
by sending a predifined clientID for the Webapp dashboard.

If the server is down the front-end application will retry to connect automatically.

## Server (Websocket)

The server folder contains the Websocket server (server.js). For development purpose there is a "mock" folder to simulate
a fleet of drones. Each drone is assigned a random ID at server boot time.

## Development

Both the client and the server need and environment file to be set. As the client isn't secure you will find it in the repository.
For the server, there is an ".example.env" file that you need to rename to ".env". In this file you will need to define the
`DASHBOARD_CLIENT_ID` variable and make it match the `REACT_APP_WS_CLIENT_ID` from the .env file of the client.

### Dependencies

You first need to install the dependencies for both the client and the server

```sh
cd client && npm install
cd server && npm install
```

Then you can start both the client and the server with the same command

```sh
npm start
```

### Docker

There is also a docker-compose file to launch both the server and the client

```sh
docker-compose up

# You can access the drones dashboard at
# http://localhost:4007
```
