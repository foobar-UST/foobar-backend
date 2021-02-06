const OrderState = require("../../models/OrderState");
const OrderLocation = require("../../models/OrderLocation");

module.exports = async function orderDeliveredRemoveLocationTask(change, context) {
  const orderId = context.params.orderId;
  const newOrderDetail = change.after.data();

  if (newOrderDetail.state === OrderState.DELIVERED) {
    return await OrderLocation.delete(orderId);
  }

  return true;
};
