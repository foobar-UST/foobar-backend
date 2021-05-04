const UserCart = require("../../models/UserCart");
const CartItem = require("../../models/CartItem");

module.exports = async function sectionUpdateRequireCartSyncTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.data();
  const newSectionDetail = change.after.data();

  // Clear user cart if the section is unavailable or deleted.
  if (!newSectionDetail.available) {
    const userIds = await UserCart.getUserIdsBy('section_id', sectionId);
    return await CartItem.deleteAllForUsers(userIds);
  }

  // Fields required to sync.
  const syncRequired = !newSectionDetail ||
    prevSectionDetail.delivery_cost !== newSectionDetail.delivery_cost ||
    prevSectionDetail.delivery_time !== newSectionDetail.delivery_time ||
    prevSectionDetail.image_url !== newSectionDetail.image_url ||
    prevSectionDetail.delivery_location.address !== newSectionDetail.delivery_location.address ||
    prevSectionDetail.delivery_location.address_zh !== newSectionDetail.delivery_location.address_zh;

  if (!syncRequired) {
    return true;
  }

  // Get the ids of the user whose are having cart orders from the updated seller.
  const userIds = await UserCart.getUserIdsBy('section_id', sectionId);

  // Return if no cart is associated with the current section.
  if (userIds.length === 0) {
    return true;
  }

  // Return a list of user ids without duplicates
  const updateUserCartPromises = userIds.map(userId => {
    return UserCart.update(userId, { sync_required: true });
  });

  return await Promise.all(updateUserCartPromises);
}