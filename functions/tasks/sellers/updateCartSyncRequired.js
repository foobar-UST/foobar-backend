const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");

module.exports = async function updateCartSyncRequiredTask(change, context) {
  //const sellerId = context.params.sellerId;
  const itemId          = context.params.itemId;
  const prevItemDetail  = change.before.exists ? change.before.data() : null;
  const currItemDetail  = change.after.exists ? change.after.data() : null;

  // Return if the item is just being created.
  if (!prevItemDetail) return true;

  // Conditions for setting 'sync_required' for user cart.
  const syncRequired = !currItemDetail ||
                        prevItemDetail.title !== currItemDetail.title ||
                        prevItemDetail.title_zh !== currItemDetail.title_zh ||
                        prevItemDetail.price !== currItemDetail.price ||
                        prevItemDetail.available !== currItemDetail.available;

  // Return if sync is not needed.
  if (!syncRequired) return true;

  // Get the ids of the users having the item in cart and raise 'sync_required' flag for them.
  const cartItems = await CartItem.getByItemId(itemId);

  // Return if no cart item associated with the item id.
  if (!cartItems) return true;

  const userIds = cartItems.map(cartItem => cartItem.user_id);
  const updateJobs = userIds.map(userId => {
    return UserCart.update(userId, { sync_required: true });
  });

  return await Promise.all(updateJobs);
};