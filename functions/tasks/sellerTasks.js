const functions = require('firebase-functions');
const { SELLERS_COLLECTION, SELLER_ITEMS_SUB_COLLECTION, SELLER_CATALOGS_SUB_COLLECTION, SELLER_SECTIONS_SUB_COLLECTION } = require('../constants');
const linkSellersBasicTask = require('./sellers/linkSellersBasic');
const linkItemsBasicTask = require('./sellers/linkItemsBasic');
const updateItemAvailabilityTask = require('./sellers/updateItemAvailability');
const itemUpdateRequireCartSyncTask = require('./sellers/itemUpdateRequireCartSync');
const linkSectionsBasicTask = require('./sellers/linkSectionsBasic');
const sellerUpdateRequireCartSyncTask = require('./sellers/sellerUpdateRequireCartSync');
const sectionUpdateRequireCartSyncTask = require('./sellers/sectionUpdateRequireCartSync');

// Link with 'seller_basic' collection.
exports.linkSellersBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onWrite(linkSellersBasicTask);

// Update users' cart info when a seller is updated, don't need
// to handle the delete case here, as the deleteSellerResource
// will delete all seller items and set the 'sync_required' flag.
exports.sellerUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onUpdate(sellerUpdateRequireCartSyncTask);

// Update items' available state based on their belonged catalog state
exports.updateItemAvailability = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_CATALOGS_SUB_COLLECTION}/{catalogId}`)
  .onWrite(updateItemAvailabilityTask);

// Link with 'items_basic' sub-collection.
exports.linkItemsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(linkItemsBasicTask);

// Update users' cart info when a item is updated.
exports.itemUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(itemUpdateRequireCartSyncTask);

// Link with 'sections_basic' sub-collection.
exports.linkSectionsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onWrite(linkSectionsBasicTask);

// Update users' cart info when a section is updated.
exports.sectionUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_SECTIONS_SUB_COLLECTION}/{sectionId}`)
  .onWrite(sectionUpdateRequireCartSyncTask);

