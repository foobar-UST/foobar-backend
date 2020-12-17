const Seller = require("../../models/Seller");

/**
 * Link 'sellers' collection with 'sellers_basic' collection.
 */
module.exports = async function linkSellersBasicTask(change, context) {
  const seller = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;

  // Delete 'sellers_basic' document
  if (seller === null) {
    return await Seller.deleteBasic(sellerId);
  }

  // Update 'sellers_basic' document
  return await Seller.createBasic(sellerId, {
    id:             seller.id,
    name:           seller.name,
    name_zh:        seller.name_zh,
    image_url:      seller.image_url,
    min_spend:      seller.min_spend,
    rating:         seller.rating,
    rating_count:   seller.rating_count,
    type:           seller.type,
    online:         seller.online,
    tags:           seller.tags
  });
};