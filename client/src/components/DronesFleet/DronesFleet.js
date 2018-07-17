import React, { PureComponent } from 'react';

import './DronesFleet.css';
import ws from '../../utils/ws';

export default class DronesFleet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      drones: {},
    };
    this.onWSmessage = this.onWSmessage.bind(this);
    ws.addListener(this.onWSmessage);
    if (ws.connected) {
      this.loadInitialData();
    }
  }

  async loadInitialData() {
    const url = `${process.env.REACT_APP_API_HOST}/status`;
    const res = await fetch(url);
    let allDrones = await res.json();

    this.setState(prevState => {
      /**
       * We merge drones update that we already have
       * on top of the complete fleet data loaded
       */
      allDrones = Object.keys(allDrones).map(k => ({ id: k, position: allDrones[k] }));
      const drones = Object.assign({}, allDrones, prevState.drones);
      return { drones };
    });
  }

  onWSmessage({ type, payload } = {}) {
    if (type === 'DRONES_UPDATE') {
      // If we don't have yet any drones loaded, we call the API
      // with the data of *all* the drones
      if (!Object.keys(this.state.drones).length) {
        this.loadInitialData();
      }
      const drones = payload || {};
      this.setState({ drones: Object.keys(drones).map(k => ({ id: k, position: drones[k] })) });
    }
  }

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        drones: this.state.drones,
      })
    );

    return <div className="c-drones-fleet">{children}</div>;
  }
}
