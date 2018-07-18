import React from 'react';

import './DronesList.css';
import DronesListItem from './DronesListItem';

export default ({ drones }) => {
  return (
    <div className="c-drones-list">
      <h2>List of drones</h2>
      <p style={{ color: '#666', fontSize: '12px' }}>
        Inactive drones (that haven't been moving for more than 10 sec) are highlited.
      </p>
      <table className="c-drones-list__table">
        <tbody>
          <tr>
            <th scope="col">Drone ID</th>
            <th scope="col">Speed (m/s)</th>
          </tr>
          {Object.keys(drones).map(k => <DronesListItem key={k} drone={drones[k]} />)}
        </tbody>
      </table>
    </div>
  );
};
