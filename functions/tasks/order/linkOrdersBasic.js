const Order = require("../../models/Order");

/**
 * Link 'orders' collection with 'orders_basic' sub-collection.
 */
module.exports = async function linkOrdersBasicTask(change, context) {
  const newOrderDetail = change.after.exists ? change.after.data() : null;
  const orderId = context.params.orderId;

  if (newOrderDetail === null) {
    return await Order.deleteBasic(orderId);
  }

  return await Order.createBasic(orderId, {
    title: newOrderDetail.title,
    title_zh: newOrderDetail.title_zh,
    user_id: newOrderDetail.user_id,
    seller_id: newOrderDetail.seller_id,
    seller_name: newOrderDetail.seller_name,
    seller_name_zh: newOrderDetail.seller_name_zh,
    section_id: newOrderDetail.section_id,
    identifier: newOrderDetail.identifier,
    image_url: newOrderDetail.image_url,
    type: newOrderDetail.type,
    order_items_count: newOrderDetail.order_items_count,
    state: newOrderDetail.state,
    delivery_address: newOrderDetail.delivery_location.address,
    delivery_address_zh: newOrderDetail.delivery_location.address_zh,
    total_cost: newOrderDetail.total_cost,
    created_at: newOrderDetail.created_at,
    updated_at: newOrderDetail.updated_at
  });
};