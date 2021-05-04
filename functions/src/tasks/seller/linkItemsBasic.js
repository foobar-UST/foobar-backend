const SellerItem = require("../../models/SellerItem");

/**
 * Link 'items' sub-collection with 'items_basic' sub-collection.
 */
module.exports = async function linkItemsBasicTask(change, context) {
  const itemDetail  = change.after.exists ? change.after.data() : null;
  const sellerId    = context.params.sellerId;
  const itemId      = context.params.itemId;

  // Delete 'items_basic' document
  if (!itemDetail) {
    return await SellerItem.deleteBasic(sellerId, itemId);
  }

  // Update 'items_basic' document
  return await SellerItem.createBasic(sellerId, itemId, {
    id:           itemDetail.id,
    title:        itemDetail.title,
    title_zh:     itemDetail.title_zh,
    catalog_id:   itemDetail.catalog_id,
    price:        itemDetail.price,
    image_url:    itemDetail.image_url,
    count:        itemDetail.count,
    available:    itemDetail.available
  });
};