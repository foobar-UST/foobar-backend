const UserCart = require("../../models/UserCart");
const CartItem = require("../../models/CartItem");

module.exports = async function sectionUpdateRequireCartSyncTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.exists ? change.before.data() : null;
  const newSectionDetail = change.after.exists ? change.after.data() : null;

  // Return if the section is just being created.
  if (!prevSectionDetail) {
    return true;
  }

  // Clear user cart if the section is unavailable or deleted.
  if (!newSectionDetail || !newSectionDetail.available) {
    console.log('[SectionUpdateRequireCartSync]: Unavailable section. Clearing user carts.');
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

  // Get the ids of the users whose are having cart orders from the updated seller.
  const userIds = await UserCart.getUserIdsBy('section_id', sectionId);

  // Return if no cart is associated with the current section.
  if (userIds.length === 0) {
    return true;
  }

  // Return a list of user ids without duplicates
  const syncJobs = userIds.map(userId => {
    return UserCart.update(userId, { sync_required: true });
  });

  return await Promise.all(syncJobs);
}