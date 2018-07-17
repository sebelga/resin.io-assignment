import React from 'react';

export default ({ drone }) => {
  return (
    <tr>
      <td>{drone.id}</td>
      <td>
        Lat: {drone.position.lat}, Long: {drone.position.lng}
      </td>
      <td>{drone.speed}</td>
    </tr>
  );
};
