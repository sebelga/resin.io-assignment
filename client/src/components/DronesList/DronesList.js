import React from 'react';

import './DronesList.css';
import DronesListItem from './DronesListItem';

export default ({ drones }) => {
  return (
    <div className="c-drones-list">
      <h2>List of drones</h2>
      <table className="c-drones-list__table">
        <tbody>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Position</th>
            <th scope="col">Speed (m/s)</th>
          </tr>
          {Object.keys(drones).map(k => <DronesListItem key={k} drone={drones[k]} />)}
        </tbody>
      </table>
    </div>
  );
};
