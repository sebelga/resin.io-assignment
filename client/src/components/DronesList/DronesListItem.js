import React from 'react';

export default ({ drone }) => {
  return (
    <tr className={drone.status === '__stopped__' ? 'c-drones-list-item--stopped' : null}>
      <td>{drone.id}</td>
      <td>
        Lat: {drone.pos.lat}, Long: {drone.pos.lng}
      </td>
      <td>{Math.round(drone.speed)}</td>
    </tr>
  );
};
