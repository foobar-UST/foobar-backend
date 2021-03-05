const MAX_INT = 2147483647;

const randomInt = () => {
  return Math.floor(Math.random() * MAX_INT) + 1;
};

module.exports = {
  randomInt
};