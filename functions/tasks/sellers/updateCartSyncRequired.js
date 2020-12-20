const UserCartItem = require("../../models/UserCartItem");
const UserCart = require("../../models/UserCart");

module.exports = async function updateCartSyncRequiredTask(change, context) {
  //const sellerId = context.params.sellerId;
  const itemId = context.params.itemId;

  // Get all users who are having the item in their cart
  let userIds = [];
  const cartItemsRefs = await UserCartItem.findRefsByItemId(itemId);

  // Return if no cart item associated with the item id
  if (cartItemsRefs.length === 0) {
    return true;
  }

  cartItemsRefs.forEach(ref => {
    const userDoc = ref.parent.parent;
    userIds.push(userDoc.id);
  });

  const updateJobs = userIds.map(userId => {
    return UserCart.update(userId, {
      sync_required: true
    })
  });

  return await Promise.all(updateJobs);
};