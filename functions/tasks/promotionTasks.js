const { functions } = require('../config');
const randomizeAdvertiseBasicsTask = require('./promotion/randomizeAdvertiseBasicsTask');

// Randomize 'advertise_basics' documents every day to ensure display fairness.
// (every day at 00:00)
exports.randomizeAdvertiseBasics = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(randomizeAdvertiseBasicsTask);