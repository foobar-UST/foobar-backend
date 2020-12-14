const functions = require('firebase-functions');
const { USERS_COLLECTION, USER_CART_ITEMS_SUB_COLLECTION } = require('../constants');

const updateCartItemTotalPriceTask = require('./cart/updateCartItemTotalPrice');
const updateUserCartInfoTask = require('./cart/updateUserCartInfo');

/*
exports.updateCartItemTotalPrice = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}/${USER_CART_ITEMS_SUB_COLLECTION}/{cartItemId}`)
  .onWrite(updateCartItemTotalPriceTask);

 */

exports.updateUserCartInfo = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}/${USER_CART_ITEMS_SUB_COLLECTION}/{cartItemId}`)
  .onWrite(updateUserCartInfoTask);
