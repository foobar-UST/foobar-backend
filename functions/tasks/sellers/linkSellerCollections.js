const { db } = require('../../config');
const { SELLERS_BASIC_COLLECTION } = require('../../constants');

/**
 * Link 'sellers' collection with 'sellers_basic' collection.
 * 1. Link deletion
 * 2. Link update
 */
module.exports = async function linkSellerCollectionsTask(change, context) {
  const document = change.after.exists ? change.after.data() : null;

  // Delete seller_basic document
  if (document === null) {
    return await db.collection(SELLERS_BASIC_COLLECTION)
      .doc(change.before.id)
      .delete();
  }

  // Update seller_basic document
  return await db.collection(SELLERS_BASIC_COLLECTION)
    .doc(change.after.id)
    .set({
      id:             document.id,
      name:           document.name,
      name_zh:        document.name_zh,
      image_url:      document.image_url,
      min_spend:      document.min_spend,
      rating:         document.rating,
      rating_count:   document.rating_count,
      type:           document.type,
      online:         document.online,
      tags:           document.tags
    });
};