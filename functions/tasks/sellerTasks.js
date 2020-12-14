const functions = require('firebase-functions');
const { SELLERS_COLLECTION, SELLER_ITEMS_SUB_COLLECTION, SELLER_CATALOGS_SUB_COLLECTION } = require('../constants');
const linkSellerCollectionsTask = require('./sellers/linkSellerCollections');
const linkItemSubCollectionsTask = require('./sellers/linkItemSubCollections');
const deleteCatalogItemsTask = require('./sellers/deleteCatalogItems');
const updateItemCartSyncRequiredTask = require('./sellers/updateItemCartSyncRequired');

exports.linkSellerCollections = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onWrite(linkSellerCollectionsTask);

exports.linkItemSubCollections = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(linkItemSubCollectionsTask);

exports.deleteCatalogItems = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_CATALOGS_SUB_COLLECTION}/{catalogId}`)
  .onDelete(deleteCatalogItemsTask);

/*
exports.updateItemCartSyncRequired = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(updateItemCartSyncRequiredTask);

 */