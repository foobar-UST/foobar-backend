const functions = require('firebase-functions');
const { SELLERS_COLLECTION, SELLER_ITEMS_SUB_COLLECTION, SELLER_CATALOGS_SUB_COLLECTION } = require('../constants');
const linkSellersBasicTask = require('./sellers/linkSellersBasic');
const linkItemsBasicTask = require('./sellers/linkItemsBasic');
const updateItemAvailabilityTask = require('./sellers/updateItemAvailability');
const updateCartSyncRequiredTask = require('./sellers/updateCartSyncRequired');

exports.linkSellersBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onWrite(linkSellersBasicTask);

/*
exports.linkItemsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(linkItemsBasicTask);

 */

exports.updateItemAvailability = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_CATALOGS_SUB_COLLECTION}/{catalogId}`)
  .onWrite(updateItemAvailabilityTask);

exports.updateItemCartSyncRequired = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(updateCartSyncRequiredTask);