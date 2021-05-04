const UserCart = require("../../models/UserCart");
const CartItem = require("../../models/CartItem");

module.exports = async function sectionUpdateRequireCartSyncTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.exists ? change.before.data() : null;
  const newSectionDetail = change.after.exists ? change.after.data() : null;

  const sectionUnavailable = !newSectionDetail || !newSectionDetail.available;

  // Delete user cart.
  if (sectionUnavailable) {
    const userCarts = await UserCart.getWithSection(sectionId);
    const userIds = userCarts.map(cart => cart.user_id);

    return await CartItem.deleteAllForUsers(userIds);
  }

  // Fields required to sync.
  const syncRequired =
    prevSectionDetail.delivery_cost !== newSectionDetail.delivery_cost ||
    prevSectionDetail.delivery_time !== newSectionDetail.delivery_time ||
    prevSectionDetail.image_url !== newSectionDetail.image_url ||
    prevSectionDetail.delivery_location.address !== newSectionDetail.delivery_location.address ||
    prevSectionDetail.delivery_location.address_zh !== newSectionDetail.delivery_location.address_zh;

  if (syncRequired) {
    // Get the ids of the user whose are having cart orders from the updated seller.
    const userCarts = await UserCart.getWithSection(sectionId);
    const userIds = userCarts.map(cart => cart.user_id);

    const updatePromises = userIds.map(userId => {
      return UserCart.update(userId, { sync_required: true });
    });

    await Promise.all(updatePromises);
  }

  return true;
}