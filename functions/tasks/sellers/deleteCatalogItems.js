const { SELLERS_COLLECTION, SELLER_ITEMS_SUB_COLLECTION } = require("../../constants");
const { db } = require('../../config');

/**
 * When a 'catalog' is removed, delete all its child 'items'.
 */
module.exports = async function deleteCatalogItemsTask(snap, context) {
  const sellerId = context.params.sellerId;
  const catalogId = context.params.catalogId;

  const itemCollection = db.collection(SELLERS_COLLECTION)
    .doc(sellerId)
    .collection(SELLER_ITEMS_SUB_COLLECTION);

  // Search all 'items' with the given catalogId
  let itemsId = [];

  (await itemCollection
    .where('catalog_id', '==', catalogId)
    .get())
    .forEach(document => itemsId.push(document.data().id));

  const deleteItemsJob = itemsId.map(itemId => {
    return itemCollection.doc(itemId).delete();
  });

  return await Promise.all(deleteItemsJob);
};