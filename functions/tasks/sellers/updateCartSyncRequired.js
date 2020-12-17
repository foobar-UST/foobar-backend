const { db } = require('../../config');
const { USER_CART_ITEMS_SUB_COLLECTION, USER_CARTS_COLLECTION } = require("../../constants");

/**
 * When the seller issues changes to an 'items',
 * search for all users who are having that item in their cart,
 * set 'sync_required' flag to true in 'user_carts' to notify
 * the users to update their carts.
 */
module.exports = async function updateCartSyncRequiredTask(change, context) {
  const itemId = context.params.itemId;

  // Get all users who are having the item in their cart
  let userIds = [];

  (await db.collectionGroup(USER_CART_ITEMS_SUB_COLLECTION)
    .where('item_id', '==', itemId)
    .get())
    .forEach(doc => {
      // Navigate to upper level 'users' document
      const userDoc = doc.ref.parent.parent;
      userIds.push(userDoc.id);
    });

  // Update 'sync_required' flag for selected users
  const updateSyncRequiredJobs = userIds.map(userId => {
    return db.collection(USER_CARTS_COLLECTION)
      .doc(userId)
      .update({
        sync_required: true
      });
  });

  return await Promise.all(updateSyncRequiredJobs);
};