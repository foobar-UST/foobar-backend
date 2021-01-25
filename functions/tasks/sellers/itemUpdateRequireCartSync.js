const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");

module.exports = async function itemUpdateRequireCartSyncTask(change, context) {
  const itemId          = context.params.itemId;
  const prevItemDetail  = change.before.exists ? change.before.data() : null;
  const newItemDetail   = change.after.exists ? change.after.data() : null;

  // Return if the item is just being created.
  if (!prevItemDetail) {
    return true;
  }

  // Conditions for setting 'sync_required' for user cart.
  const syncRequired = !newItemDetail ||
    prevItemDetail.title !== newItemDetail.title ||
    prevItemDetail.title_zh !== newItemDetail.title_zh ||
    prevItemDetail.price !== newItemDetail.price ||
    prevItemDetail.available !== newItemDetail.available;

  if (!syncRequired) {
    return true;
  }

  // Get the ids of the users having the item in cart and
  // set 'sync_required' flag for them.
  const cartItems = await CartItem.getByItemId(itemId);

  if (!cartItems) {
    return true;
  }

  // Return a list of user ids without duplicates
  const userIds = Array.from(new Set(
    cartItems.map(cartItem => cartItem.user_id)
  ));
  const syncJobs = userIds.map(userId => {
    return UserCart.update(userId, { sync_required: true });
  });

  return await Promise.all(syncJobs);
};