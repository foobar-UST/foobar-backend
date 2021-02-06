const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Seller = require("../../models/Seller");
const SellerSection = require("../../models/SellerSection");
const SellerItem = require("../../models/SellerItem");
const generateIdentifier = require("../../utils/generateIdentifier");
const Order = require("../../models/Order");
const { SectionState } = require("../../models/SectionState");
const OrderState = require("../../models/OrderState");
const SellerType = require("../../models/SellerType");
const OrderType = require("../../models/OrderType");
const OrderLocation = require("../../models/OrderLocation");
const { generateLongDynamicLink } = require("../../tasks/utils/generateDynamicLink");
const { isSameDay } = require("../../utils/DateUtils");
const { UPDATE_ORDER_STATE_INVALID_STATE } = require("../responses/ResponseMessage");
const { ORDER_CANCEL_ORDER_SELLER_OFFLINE } = require("../responses/ResponseMessage");
const { ORDER_CANCEL_ORDER_NOT_PROCESSING } = require("../responses/ResponseMessage");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { admin } = require("../../config");
const { ORDER_STATE_PROCESSING } = require("../../constants");
const { sendErrorResponse } = require("../responses/sendResponse");
const { v4: uuidv4 } = require('uuid');
const { ORDER_ADD_NEW_ORDER_PROFILE_NOT_COMPLETED } = require("../responses/ResponseMessage");
const { USER_ROLES_USER } = require("../../constants");
const { ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_SELLER_OFFLINE } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_NO_CART_ITEM } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_CART_NEED_SYNC } = require("../responses/ResponseMessage");

const placeOrder = async (req, res) => {
  const userId = req.currentUser.uid;
  const userDetail = req.userDetail;
  const paymentMethod = req.body.payment_method;
  const message = req.body.message;

  const [userCart, cartItems] = await Promise.all([
    UserCart.get(userId),
    CartItem.getAll(userId)
  ]);

  const {
    seller_id: sellerId,
    seller_type: sellerType,
    section_id: sectionId
  } = userCart;

  const sellerDetail = await Seller.getDetail(sellerId);
  const sectionDetail = await SellerSection.getDetail(sectionId);

  // Ensure the user has filled in his profile
  if (!userDetail.roles.includes(USER_ROLES_USER) || !userDetail.name || !userDetail.phone_num) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_PROFILE_NOT_COMPLETED);
  }

  // Ensure user cart is not empty
  if (!userCart || userCart.items_count === 0 || cartItems.length === 0) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_NO_CART_ITEM);
  }

  // Ensure user cart is synchronized
  if (userCart.sync_required === true) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_CART_NEED_SYNC);
  }

  const itemIds = cartItems.map(cartItem => cartItem.item_id);
  const itemDetails = [];

  // Fetch all items in cart
  await Promise.all(itemIds.map(async itemId => {
    const itemDetail = await SellerItem.getDetail(sellerId, itemId);
    itemDetails.push(itemDetail);
  }));

  // Ensure all items are available
  if (!itemDetails.every(item => item.available)) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM);
  }

  // Ensure all items have enough quantities
  if (!itemDetails.every(item => item.count > 0)) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM);
  }

  // Ensure all items are from the same seller
  if (!itemDetails.every(item => item.seller_id === itemDetails[0].seller_id)) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM);
  }

  // Ensure the total cost of the order is greater than the minimum spend requirement of the seller
  if (userCart.total_cost < sellerDetail.min_spend) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND);
  }

  // Ensure the seller is online
  if (!sellerDetail.online) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_SELLER_OFFLINE);
  }

  // Validate off-campus order
  if (sectionDetail) {
    const timestampNow = admin.firestore.Timestamp.now();
    const isSectionAvailable = sectionDetail.available &&
      sectionDetail.state === SectionState.AVAILABLE &&
      sectionDetail.cutoff_time > timestampNow &&
      sectionDetail.delivery_time > timestampNow &&
      isSameDay(timestampNow.toDate(), sectionDetail.delivery_time.toDate());

    // Ensure the section is currently opened
    if (!isSectionAvailable) {
      return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE);
    }
  }

  // Collect all order items
  const orderItems = cartItems.map(cartItem => {
    return {
      id:                   uuidv4(),
      item_id:              cartItem.item_id,
      item_seller_id:       cartItem.item_seller_id,
      item_title:           cartItem.item_title,
      item_title_zh:        cartItem.item_title_zh,
      item_price:           cartItem.item_price,
      item_image_url:       cartItem.image_url,
      amounts:              cartItem.amounts,
      total_price:          cartItem.total_price
    }
  });

  // Create a new order
  const newOrderDoc = Order.createDoc();
  const newOrderId = newOrderDoc.id;
  const newOrderIdentifier = generateIdentifier(5);
  const newOrderType = sellerType === SellerType.ON_CAMPUS ? OrderType.ON_CAMPUS : OrderType.OFF_CAMPUS;

  const newOrderSectionTitle = sectionDetail ? sectionDetail.title : null;
  const newOrderSectionTitleZh = sectionDetail ? sectionDetail.title_zh : null;

  const newOrderDetail = {
    title:                  userCart.title,
    title_zh:               userCart.title_zh,
    user_id:                userId,
    seller_id:              sellerId,
    seller_name:            sellerDetail.name,
    seller_name_zh:         sellerDetail.name_zh,
    section_id:             sectionId,
    section_title:          newOrderSectionTitle,
    section_title_zh:       newOrderSectionTitleZh,
    deliverer_id:           null,
    identifier:             newOrderIdentifier,
    image_url:              userCart.image_url,
    type:                   newOrderType,
    order_items:            orderItems,
    state:                  ORDER_STATE_PROCESSING,
    is_paid:                true,
    payment_method:         paymentMethod,
    message:                message,
    delivery_location:      sectionDetail ? sectionDetail.delivery_location : sellerDetail.location,
    subtotal_cost:          userCart.subtotal_cost,
    delivery_cost:          userCart.delivery_cost,
    total_cost:             userCart.total_cost,
  };

  await Order.createDetail(newOrderDoc, newOrderDetail);

  // Decrement the quantity of purchased seller items
  await Promise.all(cartItems.map(cartItem => {
    return SellerItem.updateDetail(sellerId, cartItem.item_id, {
      count: admin.firestore.FieldValue.increment(-cartItem.amounts)
    });
  }));

  // Clear the cart
  await CartItem.deleteAllForUser(userId);

  // Generate order link
  const dynamicLink = generateLongDynamicLink(
    `https://foobar-group-delivery-app.web.app/order/${newOrderId}`
  );

  return sendSuccessResponse(res, {
    order_id: newOrderId,
    order_identifier: newOrderIdentifier,
    link: dynamicLink
  });
};

const cancelOrder = async (req, res) => {
  const orderId = req.body.order_id;

  const orderDetail = await Order.getDetail(orderId);
  const sellerDetail = await Seller.getDetail(orderDetail.seller_id);

  // Check if the seller is online
  if (!sellerDetail.online) {
    return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_SELLER_OFFLINE);
  }

  // Check the current order state.
  // User can only can cancel order during 'processing' state.
  if (orderDetail.state !== OrderState.PROCESSING) {
    return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_NOT_PROCESSING);
  }

  // Set order state to cancelled
  await Order.updateDetail(orderId, { state: OrderState.CANCELLED });

  return sendSuccessResponse(res);
};

const updateOrderState = async (req, res) => {
  const orderId = req.body.order_id;
  const newOrderState = req.body.order_state;
  const orderDetail = await Order.getDetail(orderId);

  // On-campus order should not have IN_TRANSIT state
  if (orderDetail.type === OrderType.ON_CAMPUS && newOrderState === OrderState.IN_TRANSIT) {
    return sendErrorResponse(res, 403, UPDATE_ORDER_STATE_INVALID_STATE);
  }

  // Update order state
  await Order.updateDetail(orderId, { state: newOrderState });

  return sendSuccessResponse(res);
};

const updateOrderLocation = async (req, res) => {
  const orderId = req.body.order_id;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const delivererId = req.currentUser.uid;

  await OrderLocation.upsert(orderId, {
    deliverer_id: delivererId,
    current_location: new admin.firestore.GeoPoint(latitude, longitude)
  });

  return sendSuccessResponse(res);
};

const confirmOrderDelivered = async (req, res) => {
  const orderId = req.body.order_id;
  await Order.updateDetail(orderId, { state: OrderState.DELIVERED });
  return sendSuccessResponse(res);
};

module.exports = {
  placeOrder,
  cancelOrder,
  updateOrderState,
  updateOrderLocation,
  confirmOrderDelivered
}