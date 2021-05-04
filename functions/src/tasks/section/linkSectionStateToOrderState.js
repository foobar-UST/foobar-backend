const Order = require("../../models/Order");
const OrderState = require('../../models/OrderState');
const { SectionState } = require("../../models/SectionState");
const { toOrderState } = require("../../models/SectionState");

module.exports = async function linkSectionStateToOrderStateTask(change, context) {
  const sectionId = context.params.sectionId;
  const prevSectionDetail = change.before.exists ? change.before.data() : null;
  const newSectionDetail = change.after.exists ? change.after.data() : null;

  const isUpdate = prevSectionDetail && newSectionDetail;

  const updatePromises = [];

  // When the section is deleted, update all order states to cancelled.
  if (!newSectionDetail) {
    // Get the associated orders.
    const orderDetails = await Order.getDetailsBySection(sectionId);
    const orderIds = orderDetails.map(order => order.id);

    const updateStatePromises = orderIds.map(orderId => {
      return Order.updateDetail(orderId, {
        state: OrderState.CANCELLED
      });
    });

    updatePromises.push(...updateStatePromises);
  } else {
    // No state change when section is updated.
    if (isUpdate &&
      prevSectionDetail.state === newSectionDetail.state) {
      return true;
    }

    // No need to sync order state if section is still 'available' or 'delivered'.
    if (isUpdate &&
      newSectionDetail.state === SectionState.AVAILABLE ||
      newSectionDetail.state === SectionState.DELIVERED) {
      return true;
    }

    // Get the associated orders.
    const orderDetails = await Order.getDetailsBySection(sectionId);
    const orderIds = orderDetails.map(order => order.id);

    const newOrderState = toOrderState(newSectionDetail.state);

    const updateStatePromises = orderIds.map(orderId => {
      return Order.updateDetail(orderId, {
        state: newOrderState
      });
    });

    updatePromises.push(...updateStatePromises);
  }

  return await Promise.all(updatePromises);
};