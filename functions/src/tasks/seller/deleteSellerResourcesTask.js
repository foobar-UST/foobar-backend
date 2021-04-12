const Seller = require('../../models/Seller');

module.exports = async function deleteSellerResourcesTask(snap, context) {
  const sellerId = context.params.sellerId;
  return await Seller.deleteImage(sellerId);
};