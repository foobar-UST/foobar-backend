const { db } = require('../../config');
const { SELLERS_BASIC_COLLECTION } = require('../../constants');

module.exports = function copySellerDataTask(change, context) {
  const document = change.after.exists ? change.after.data() : null;

  // Remove 'seller_basic' document
  if (document === null) {
    return db.collection(SELLERS_BASIC_COLLECTION)
      .doc(change.before.id)
      .delete()
      .then(() => {
        console.log(`[Success] Seller document deleted.`);
        return true;
      })
      .catch(err => {
        console.log(`[Error] Failed to delete seller document: ${err}`);
      });
  }

  // Update 'seller_basic' document
  return db.collection(SELLERS_BASIC_COLLECTION)
    .doc(change.after.id)
    .set({
      id: document.id,
      name: document.name,
      name_zh: document.name_zh,
      image_url: document.image_url,
      min_spend: document.min_spend,
      rating: document.rating,
      rating_count: document.rating_count,
      type: document.type,
      online: document.online,
      tags: document.tags
    })
    .then(() => {
      console.log(`[Success] Seller document updated.`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to update seller document: ${err}`);
    });
};