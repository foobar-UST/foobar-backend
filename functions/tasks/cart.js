const functions = require('firebase-functions');
const { 
  USERS_COLLECTION, 
  USER_CART_ITEMS_SUB_COLLECTION, 
  SELLER_ITEMS_SUB_COLLECTION, 
  SELLERS_COLLECTION } = require('../constants');
const updateUserCartTask = require('./cart/updateUserCart');
const syncUserCartItemsTask = require('./cart/syncUserCartItems');

/**
 * Update 'user_carts' and update the cart item's 'total_price'.
 * Triggered when there is changes in 'cart_items' subcollection.
 */
exports.updateUserCart = functions.firestore
  .document(`${USERS_COLLECTION}/{userId}/${USER_CART_ITEMS_SUB_COLLECTION}/{cartItemId}`)
  .onWrite(updateUserCartTask);

exports.syncUserCartItems = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(syncUserCartItemsTask);