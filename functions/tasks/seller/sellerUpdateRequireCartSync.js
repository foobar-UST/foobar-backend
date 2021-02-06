const UserCart = require("../../models/UserCart");

module.exports = async function sellerUpdateRequireCartSyncTask(change, context) {
  const sellerId = context.params.sellerId;
  const prevSellerDetail = change.before.data();
  const newSellerDetail = change.after.data();

  // Fields required to sync.
  const syncRequired = prevSellerDetail.name !== newSellerDetail.name ||
    prevSellerDetail.name_zh !== newSellerDetail.name_zh ||
    prevSellerDetail.image_url !== newSellerDetail.image_url ||
    prevSellerDetail.location.address !== newSellerDetail.location.address ||
    prevSellerDetail.location.address_zh !== newSellerDetail.location.address_zh;

  if (!syncRequired) {
    return true;
  }

  // Get the ids of the user whose are having cart orders from the updated seller.
  const userIds = await UserCart.getUserIdsBy('seller_id', sellerId);

  // Return if no cart is associated with the current seller.
  if (userIds.length === 0) {
    return true;
  }

  // Return a list of user ids without duplicates
  const syncJobs = userIds.map(userId => {
    return UserCart.update(userId, { sync_required: true });
  });

  return await Promise.all(syncJobs);
}