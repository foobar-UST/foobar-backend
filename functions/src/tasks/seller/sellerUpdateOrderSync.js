const Order = require("../../models/Order");

module.exports = async function sellerUpdateOrderSyncTask(change, context) {
  const sellerId = context.params.sellerId;
  const prevSellerDetail = change.before.data();
  const newSellerDetail = change.after.data();

  const syncRequired = prevSellerDetail.name !== newSellerDetail.name ||
    prevSellerDetail.name_zh !== newSellerDetail.name_zh;

  if (!syncRequired) {
    return true;
  }

  // Get the ids of the orders that require sync.
  const orderIdsSnapshot = await Order.getOrderDetailCollectionRef()
    .where('seller_id', '==', sellerId)
    .get();

  const orderIds = orderIdsSnapshot.docs.map(doc => doc.data().id);

  const updateOrderPromises = orderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      seller_name:  newSellerDetail.name,
      seller_name_zh: newSellerDetail.name_zh
    });
  });

  return await Promise.all(updateOrderPromises);
};