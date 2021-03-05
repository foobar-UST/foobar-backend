const Advertise = require("../../models/Advertise");

module.exports = async function randomizeAdvertiseBasicsTask(context) {
  await Advertise.updateBasicsRandom()
  return true;
};