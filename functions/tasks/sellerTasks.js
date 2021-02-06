const { functions } = require('../config');
const { SELLERS_COLLECTION, SELLER_ITEMS_SUB_COLLECTION, SELLER_CATALOGS_SUB_COLLECTION } = require('../constants');
const linkSellersBasicTask = require('./seller/linkSellersBasic');
const linkItemsBasicTask = require('./seller/linkItemsBasic');
const updateItemAvailabilityTask = require('./seller/updateItemAvailability');
const itemUpdateRequireCartSyncTask = require('./seller/itemUpdateRequireCartSync');
const sellerUpdateRequireCartSyncTask = require('./seller/sellerUpdateRequireCartSync');
const sellerUpdateOrderSyncTask = require('./seller/sellerUpdateOrderSync');

// Link with 'seller_basic' collection.
exports.linkSellersBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onWrite(linkSellersBasicTask);

// Update user' cart info when a seller is updated, don't need
// to handle the delete case here, as the deleteSellerResource
// will delete all seller items and set the 'sync_required' flag.
exports.sellerUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onUpdate(sellerUpdateRequireCartSyncTask);

// Update orders when a seller is updated
exports.sellerUpdateOrderSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onUpdate(sellerUpdateOrderSyncTask);

// Update items' available state based on their belonged catalog state
exports.updateItemAvailability = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_CATALOGS_SUB_COLLECTION}/{catalogId}`)
  .onWrite(updateItemAvailabilityTask);

// Link with 'items_basic' sub-collection.
exports.linkItemsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(linkItemsBasicTask);

// Update user' cart info when a item is updated.
exports.itemUpdateRequireCartSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onWrite(itemUpdateRequireCartSyncTask);

// Update orders when a seller is updated.
exports.sellerUpdateOrderSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
