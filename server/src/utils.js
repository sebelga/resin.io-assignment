const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRandomFloat = (min, max, fixed) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
};

module.exports = {
  getRandomInt,
  getRandomFloat,
};
