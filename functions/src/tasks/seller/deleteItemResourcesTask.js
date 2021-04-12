const SellerItem = require('../../models/SellerItem');

module.exports = async function deleteItemResourcesTask(snap, context) {
  const itemId = context.params.itemId;
  return await SellerItem.deleteImage(itemId);
}