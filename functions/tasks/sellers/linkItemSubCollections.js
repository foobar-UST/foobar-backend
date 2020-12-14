const { SELLERS_COLLECTION, SELLER_ITEMS_BASIC_SUB_COLLECTION } = require("../../constants");
const { db } = require('../../config');

/**
 * Link 'items' sub-collection with 'items_basic' sub-collection.
 * 1. Link deletion
 * 2. Link update
 */
module.exports = async function linkItemSubCollectionsTask(change, context) {
  const document = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;

  const collection = db.collection(SELLERS_COLLECTION)
    .doc(sellerId)
    .collection(SELLER_ITEMS_BASIC_SUB_COLLECTION);

  // Delete item_basic document
  if (document === null) {
    return await collection
      .doc(change.before.id)
      .delete();
  }

  // Update item_basic document
  return await collection
    .doc(change.after.id)
    .set({
      id:           document.id,
      title:        document.title,
      title_zh:     document.title_zh,
      catalog_id:   document.catalog_id,
      price:        document.price,
      image_url:    document.image_url,
      count:        document.count,
      available:    document.available
    });
};