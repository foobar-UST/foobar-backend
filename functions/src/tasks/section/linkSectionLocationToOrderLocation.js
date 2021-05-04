const Order = require('../../models/Order');
const OrderState = require("../../models/OrderState");
const { SectionState } = require('../../models/SectionState');

module.exports = async function linkSectionLocationToOrderLocationTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.data();
  const newSectionDetail = change.after.data();

  // No location change.
  if (prevSectionDetail.deliverer_id === newSectionDetail.deliverer_id &&
      prevSectionDetail.deliverer_location === newSectionDetail.deliverer_location &&
      prevSectionDetail.deliverer_travel_mode === newSectionDetail.deliverer_travel_mode) {
    return true;
  }

  // Only sync order location when the section is being shipped.
  if (newSectionDetail.state !== SectionState.SHIPPED) {
    return true;
  }

  // Get the associated orders.
  const orderDetails = await Order.getDetailsActive(sectionId);
  const activeOrderIds = orderDetails.map(order => order.id);

  const updateOrderLocationPromises = activeOrderIds.map(orderId => {
    return Order.updateDetail(orderId, {
      deliverer_id: newSectionDetail.deliverer_id,
      deliverer_location: newSectionDetail.deliverer_location,
      deliverer_travel_mode: newSectionDetail.deliverer_travel_mode
    });
  });

  return await Promise.all(updateOrderLocationPromises);
}