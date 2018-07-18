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
      this.loadStatusDrones();
    }
  }

  async loadStatusDrones() {
    const url = `${process.env.REACT_APP_API_HOST}/status`;
    const res = await fetch(url);
    let allDrones = await res.json();

    this.setState(prevState => {
      /**
       * We merge drones update that we already have
       * on top of the complete fleet data loaded
       */
      const drones = { ...allDrones, ...prevState.drones };
      return { drones };
    });
  }

  onWSmessage({ type, payload } = {}) {
    if (type === 'DRONES_UPDATE') {
      // If we don't have any drones data in our state it means that
      // this is the first "update" we receive from the server.
      // As the update only contains information about moving drones, we
      // will ask the server for the status of all drones
      if (!Object.keys(this.state.drones).length) {
        this.loadStatusDrones();
      }

      this.setState(prevState => {
        const drones = { ...prevState.drones, ...payload };
        return { drones };
      });
    }
  }

  render() {
    // Convert hash map to Array
    const listDrones = Object.keys(this.state.drones).map(k => ({ id: k, ...this.state.drones[k] }));

    // Add the "drones" prop to all children
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        drones: listDrones,
      })
    );

    return <div className="c-drones-fleet">{children}</div>;
  }
}
