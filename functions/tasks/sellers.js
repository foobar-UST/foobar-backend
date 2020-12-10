const functions = require('firebase-functions');
const { SELLERS_COLLECTION } = require('../constants');
const copySellerDataTask = require('./sellers/copySellerData');

/**
 * Update the seller document in 'sellers_basic' collection.
 * Triggered when a document is modified in 'sellers' collection.
 */
exports.copySellerData = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onWrite(copySellerDataTask);