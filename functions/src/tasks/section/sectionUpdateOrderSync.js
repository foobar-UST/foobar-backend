const Order = require('../../models/Order');

module.exports = async function sectionUpdateOrderSyncTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.data();
  const newSectionDetail = change.after.data();

  const syncRequired = prevSectionDetail.title !== newSectionDetail.title ||
    prevSectionDetail.title_zh !== newSectionDetail.title_zh;

  if (!syncRequired) {
    return true;
  }

  // Get the ids of the orders that require sync.
  const orderDetails = await Order.getDetailsBySection(sectionId);
  const orderIds = orderDetails.map(order => order.id);

  const updateOrderPromises = orderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      section_title:  newSectionDetail.title,
      section_title_zh: newSectionDetail.title_zh
    });
  });

  return await Promise.all(updateOrderPromises);
};