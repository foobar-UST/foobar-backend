const { functions } = require('../config');
const { ORDERS_COLLECTION } = require("../constants");
const linkOrdersBasicTask = require('./order/linkOrdersBasic');
const orderDeliveredRemoveLocationTask = require('./order/orderDeliveredRemoveLocation');
const updateOrderNotifyUserTask = require('./order/updateOrderNotifyUser');
const newOrderUpdateSectionTask = require('./order/newOrderUpdateSection');

// Link with 'orders_basic' collection.
exports.linkOrdersBasic = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onWrite(linkOrdersBasicTask);

// Remove the order location's document when it is completed.
exports.orderDeliveredRemoveLocation = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onUpdate(orderDeliveredRemoveLocationTask);

// Send notifications to users when the order state is changed.
exports.updateOrderNotifyUser = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onUpdate(updateOrderNotifyUserTask);

// Update the section document when a new group order is placed.
exports.newOrderUpdateSection = functions.firestore
  .document(`${ORDERS_COLLECTION}/{orderId}`)
  .onWrite(newOrderUpdateSectionTask);





