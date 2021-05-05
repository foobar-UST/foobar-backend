const SellerItem = require('../../models/SellerItem');

module.exports = async function updateItemAvailabilityTask(change, context) {
  const prevCatalogDetail = change.before.exists ? change.before.data() : null;
  const newCatalogDetail = change.after.exists ? change.after.data() : null;
  const sellerId  = context.params.sellerId;
  const catalogId = context.params.catalogId;

  const isDelete = !newCatalogDetail;
  const isUpdate =
    prevCatalogDetail && newCatalogDetail &&
    prevCatalogDetail.available !== newCatalogDetail.available;

  // When the catalog is deleted, detach all its items.
  if (isDelete) {
    const itemIds = await SellerItem.getIdsWithCatalog(sellerId, catalogId);
    const updateJobs = itemIds.map(itemId => {
      return SellerItem.updateDetail(itemId, {
        catalog_id: null
      });
    });

    return await Promise.all(updateJobs);
  }

  // When the catalog's availability has changed, update the availability of all items.
  if (isUpdate) {
    const itemIds = await SellerItem.getIdsWithCatalog(sellerId, catalogId);
    const updateJobs = itemIds.map(itemId => {
      return SellerItem.updateDetail(itemId, {
        available: newCatalogDetail.available
      });
    });

    return await Promise.all(updateJobs);
  }

  return true;
}