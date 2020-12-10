const { db } = require('../../config');
const { USER_CARTS_COLLECTION, USER_CART_ITEMS_SUB_COLLECTION } = require('../../constants');

module.exports = async function syncUserCartItemsTask(change, context) {
  //const document = change.after.exists ? change.after.data() : null;
  //const sellerId = context.params.sellerId;
  const itemId = context.params.itemId;

  // Get all users who are having the item in their cart
  let userIds = [];
  try {
    const snapshot = await db.collectionGroup(USER_CART_ITEMS_SUB_COLLECTION)
      .where('item_id', '==', itemId)
      .get();
    
    snapshot.forEach(doc => {
      // Get the user document holding the cart item
      const cartItemsCollection = doc.ref.parent;
      const userDoc = cartItemsCollection.parent;
      userIds.push(userDoc.id);
    });
  } catch (err) {
    console.log(`[Error] Failed to get cart items: ${err}`);
    return false;
  }

  // Set 'sync_required' flag for selected users
  const setSyncRequiredJobs = userIds.map(userId => {
    return db.collection(USER_CARTS_COLLECTION)
      .doc(userId)
      .update({ sync_required: true });
  });

  return Promise.all(setSyncRequiredJobs)
    .then(() => {
      console.log('[Success] Synced user cart items.');
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to set 'sync_required' flag: ${err}`)
    });
};