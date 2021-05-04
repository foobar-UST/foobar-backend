const UserCart = require("../../models/UserCart");

module.exports = async function sellerUpdateRequireCartSyncTask(change, context) {
  const sellerId = context.params.sellerId;
  const prevSellerDetail = change.before.data();
  const newSellerDetail = change.after.data();

  const syncRequired =
    prevSellerDetail.name !== newSellerDetail.name ||
    prevSellerDetail.name_zh !== newSellerDetail.name_zh ||
    prevSellerDetail.image_url !== newSellerDetail.image_url ||
    prevSellerDetail.location.address !== newSellerDetail.location.address ||
    prevSellerDetail.location.address_zh !== newSellerDetail.location.address_zh;

  if (syncRequired) {
    // Get the ids of the user whose are having cart orders from the updated seller.
    const userCarts = await UserCart.getWithSeller(sellerId);
    const userIds = userCarts.map(cart => cart.user_id);

    const updatePromises = userIds.map(userId => {
      return UserCart.update(userId, { sync_required: true });
    });

    await Promise.all(updatePromises);
  }

  return true;
}