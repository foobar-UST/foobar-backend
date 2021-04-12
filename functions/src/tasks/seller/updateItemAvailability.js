const SellerItem = require("../../models/SellerItem");

module.exports = async function updateItemAvailabilityTask(change, context) {
  const catalog   = change.after.exists ? change.after.data() : null;
  const sellerId  = context.params.sellerId;
  const catalogId = context.params.catalogId;

  // When the catalog is deleted, find all items belong to that catalog,
  // and set catalog_id field to null
  if (catalog === null) {
    const itemIds = await SellerItem.getIdsWithCatalog(sellerId, catalogId);
    const detachItemJobs = [];

    itemIds.forEach(itemId => {
      detachItemJobs.push(
        SellerItem.updateDetail(sellerId, itemId, { catalog_id: null })
      );
    });

    return await Promise.all(detachItemJobs);
  }

  // When the catalog's available state has changed,
  // update the availability of all items as well.
  const oldAvailableState = change.before.data().available;
  const newAvailableState = change.after.data().available;

  if (oldAvailableState !== newAvailableState) {
    const itemIds = await SellerItem.getIdsWithCatalog(sellerId, catalogId);
    const updateAvailabilityJobs = [];

    itemIds.forEach(itemId => {
      updateAvailabilityJobs.push(
        SellerItem.updateDetail(sellerId, itemId, { available: newAvailableState })
      );
    });

    return await Promise.all(updateAvailabilityJobs);
  }

  return true;
}