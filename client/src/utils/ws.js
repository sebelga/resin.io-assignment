const RETRY_TIMEOUT = 1000;

class WsConnection {
  constructor() {
    /**
     * As all modern borwser send the domain cookies along with the connection
     * we add a Header to identify websocket connections from our WebApp
     *
     * For the moment we are just sending the clienID to fake authorization
     */
    const authToken = process.env.REACT_APP_WS_CLIENT_ID;
    document.cookie = 'X-Authorization=' + authToken + '; path=/';

    this.listeners = [];
    this.connect();
  }

  connect = () => {
    if (!this.ws) {
      this.ws = new WebSocket(process.env.REACT_APP_WSS_HOST, process.env.REACT_APP_WS_CLIENT_ID);
      this.ws.onopen = this.onWSopen;
      this.ws.onerror = this.onWSClose;
      this.ws.onclose = this.onWSClose;
      this.ws.onmessage = this.onServerMessage;
    }
  };

  onWSopen = () => {
    this.connected = true;
    this.listeners.forEach(l => l({ type: 'WS_CONNECTED' }));
  };

  onWSClose = () => {
    delete this.ws;
    this.connected = false;
    /**
     * If we loose the connection to the server we automatically try to reconnect
     */
    setTimeout(this.connect, RETRY_TIMEOUT);
  };

  onServerMessage = ({ data }) => {
    const _data = JSON.parse(data);
    this.listeners.forEach(l => l(_data));
  };

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners.filter(l => l !== listener);
  }
}

const wsConnection = new WsConnection();

export default wsConnection;
