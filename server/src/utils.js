const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomFloat = (min, max, fixed) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
};

/**
 * Get a new random Geo position at a distance from a point
 *
 * @param {object} geoPoint Point from which to calculate the distance. ex: { lng: 10.123, lat: 22.123 }
 * @param {number} minDistance minimum distance in meter from the point
 * @param {number} maxDistance maximum distance in meter from the point
 */
const getRandomPosFromPoint = (geoPoint, minDistance = 10, maxDistance = 25) => {
  const distLat = getRandomInt(minDistance, maxDistance);
  const distLng = getRandomInt(minDistance, maxDistance);

  // 1km in degree = 1 / 111.32km = 0.0089
  // 1m in degree = 0.0089 / 1000 = 0.0000089
  const coefLat = distLat * 0.0000089;
  const coefLng = distLng * 0.0000089;

  const lat = geoPoint.lat + coefLat;
  // pi / 180 = 0.018
  const lng = geoPoint.lng + coefLng / Math.cos(lat * 0.018);

  return { lat, lng };
};

const deg2rad = deg => deg * (Math.PI / 180);

// SOURCE: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates-shows-wrong
const getDistanceBetweenPoints = (point1, point2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLon = deg2rad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

module.exports = {
  getRandomInt,
  getRandomFloat,
  getRandomPosFromPoint,
  getDistanceBetweenPoints,
};
