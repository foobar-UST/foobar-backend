const Seller = require('../../models/Seller');

/**
 * Link 'seller' collection with 'sellers_basic' collection.
 */
module.exports = async function linkSellersBasicTask(change, context) {
  const sellerDetail = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;

  // Delete 'sellers_basic' document
  if (sellerDetail === null) {
    return await Seller.deleteBasic(sellerId);
  }

  // Update 'sellers_basic' document
  return await Seller.createBasic(sellerId, {
    name:           sellerDetail.name,
    name_zh:        sellerDetail.name_zh,
    image_url:      sellerDetail.image_url,
    min_spend:      sellerDetail.min_spend,
    order_rating:   sellerDetail.order_rating,
    type:           sellerDetail.type,
    online:         sellerDetail.online,
    tags:           sellerDetail.tags
  });
};