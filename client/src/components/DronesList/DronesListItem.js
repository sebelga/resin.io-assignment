import React from 'react';

export default ({ drone }) => {
  return (
    <tr>
      <td>{drone.id}</td>
      <td>
        Lat: {drone.pos.lat}, Long: {drone.pos.lng}
      </td>
      <td style={{ textAlign: 'center' }}>{Math.round(drone.speed)}</td>
    </tr>
  );
};
