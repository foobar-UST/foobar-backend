const { functions } = require('../config');
const { ORDERS_COLLECTION } = require("../constants");
const linkOrdersBasicTask = require('./order/linkOrdersBasic');
const updateOrderNotifyUserTask = require('./order/updateOrderNotifyUser');
const modifyOrderUpdateSectionTask = require('./order/modifyOrderUpdateSection');

// Link with 'orders_basic' collection.
exports.linkOrdersBasic = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onWrite(linkOrdersBasicTask);

// Send notifications to users when the order state is changed.
exports.updateOrderNotifyUser = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onUpdate(updateOrderNotifyUserTask);

// Update the section document when a new group order is modified.
exports.modifyOrderUpdateSection = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onWrite(modifyOrderUpdateSectionTask);





