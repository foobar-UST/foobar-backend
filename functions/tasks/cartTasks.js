const { functions } = require('../config');
const { USERS_COLLECTION, USER_CART_ITEMS_SUB_COLLECTION } = require('../constants');
const updateUserCartTask = require('./cart/updateUserCart');

exports.updateUserCart = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}/${USER_CART_ITEMS_SUB_COLLECTION}/{cartItemId}`)
  .onWrite(updateUserCartTask);
