const { TRAVEL_MODE_WALKING } = require("../constants");
const { TRAVEL_MODE_DRIVING } = require("../constants");

const TravelMode = Object.freeze({
  DRIVING: TRAVEL_MODE_DRIVING,
  WALKING: TRAVEL_MODE_WALKING
});

module.exports = TravelMode;