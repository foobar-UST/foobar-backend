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
  const orderDetails = await Order.getDetailsBySeller(sellerId);
  const orderIds = orderDetails.map(order => order.id);

  const updateOrderPromises = orderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      seller_name:  newSellerDetail.name,
      seller_name_zh: newSellerDetail.name_zh
    });
  });

  return await Promise.all(updateOrderPromises);
};