import React from 'react';

export default ({ drone }) => {
  return (
    <tr>
      <td>{drone.id}</td>
      <td>
        Lat: {drone.pos.lat}, Long: {drone.pos.lng}
      </td>
      <td>{drone.speed}</td>
    </tr>
  );
};
