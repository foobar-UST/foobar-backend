const SellerItem = require("../../models/SellerItem");

/**
 * Link 'items' sub-collection with 'items_basic' sub-collection.
 */
module.exports = async function linkItemsBasicTask(change, context) {
  const item        = change.after.exists ? change.after.data() : null;
  const sellerId    = context.params.sellerId;
  const itemId      = context.params.itemId;

  // Delete 'items_basic' document
  if (item === null) {
    return await SellerItem.deleteBasic(sellerId, itemId);
  }

  // Update 'items_basic' document
  return await SellerItem.createBasic(sellerId, itemId, {
    id:           item.id,
    title:        item.title,
    title_zh:     item.title_zh,
    catalog_id:   item.catalog_id,
    price:        item.price,
    image_url:    item.image_url,
    count:        item.count,
    available:    item.available
  });
};