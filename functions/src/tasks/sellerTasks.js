const { functions } = require('../../config');
const linkSellersBasicTask = require('./seller/linkSellersBasic');
const linkItemsBasicTask = require('./seller/linkItemsBasic');
const linkAdvertisesBasicTask = require('./seller/linkAdvertiseBasic');
const linkRatingsBasicTask = require('./seller/linkRatingsBasic');
const updateItemAvailabilityTask = require('./seller/updateItemAvailability');
const itemUpdateRequireCartSyncTask = require('./seller/itemUpdateRequireCartSync');
const sellerUpdateRequireCartSyncTask = require('./seller/sellerUpdateRequireCartSync');
const sellerUpdateOrderSyncTask = require('./seller/sellerUpdateOrderSync');
const newAdvertiseNotifyUsersTask = require('./promotion/newAdvertiseNotifyUsers');
const updateSellerRatingTask = require('./seller/updateSellerRating');
const deleteSellerResourcesTask = require('./seller/deleteSellerResourcesTask');
const deleteItemResourcesTask = require('./seller/deleteItemResourcesTask');
const { SELLERS_COLLECTION } = require('../../constants');
const { SELLER_ITEMS_SUB_COLLECTION } = require('../../constants');
const { SELLER_CATALOGS_SUB_COLLECTION } = require('../../constants');
const { SELLER_ADVERTISES_SUB_COLLECTION } = require('../../constants');
const { SELLER_RATINGS_SUB_COLLECTION } = require('../../constants');

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

// Update orders when a seller is updated.
exports.sellerUpdateOrderSync = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onUpdate(sellerUpdateOrderSyncTask);

// Delete seller resources.
exports.deleteSellerResources = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}`)
  .onDelete(deleteSellerResourcesTask);

// Update items' available state based on their belonged catalog state.
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

// Delete item resources.
exports.deleteItemResources = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/{itemId}`)
  .onDelete(deleteItemResourcesTask);

// Link with 'advertises_basic' collection.
exports.linkAdvertisesBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ADVERTISES_SUB_COLLECTION}/{advertiseId}`)
  .onWrite(linkAdvertisesBasicTask);

// Send notification to all users when a new seller advertisement is created.
exports.newAdvertiseNotifyUsers = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_ADVERTISES_SUB_COLLECTION}/{advertiseId}`)
  .onWrite(newAdvertiseNotifyUsersTask);

// Update seller average rating.
exports.updateSellerRating = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_RATINGS_SUB_COLLECTION}/{ratingId}`)
  .onWrite(updateSellerRatingTask);

// Link with 'ratings_basic' sub collection.
exports.linkRatingsBasic = functions.firestore
  .document(`${SELLERS_COLLECTION}/{sellerId}/${SELLER_RATINGS_SUB_COLLECTION}/{ratingId}`)
  .onWrite(linkRatingsBasicTask);
