const { functions } = require('../../config');
const insertSectionsFakeDataTask = require('./admin/insertSectionsFakeData');

// Insert section sample data every day (for demo purpose).
// (every day at 00:00)
/*
exports.insertSectionsFakeData = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(insertSectionsFakeDataTask);

 */