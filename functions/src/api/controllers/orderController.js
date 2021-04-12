const { admin } = require("../../../config");
const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Seller = require("../../models/Seller");
const SellerSection = require("../../models/SellerSection");
const SellerItem = require("../../models/SellerItem");
const Order = require("../../models/Order");
const { SectionState } = require("../../models/SectionState");
const OrderState = require("../../models/OrderState");
const SellerType = require("../../models/SellerType");
const OrderType = require("../../models/OrderType");
const UserRole = require("../../models/UserRole");
const generateIdentifier = require("../../utils/generateIdentifier");
const Rating = require("../../models/Rating");
const { v4: uuidv4 } = require('uuid');
const { generateLongDynamicLink } = require("../../utils/generateDynamicLink");
const { isSameDay } = require("../../utils/DateUtils");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { sendErrorResponse } = require("../responses/sendResponse");
const { RATE_ORDER_INVALID_RATING,
  ORDER_ADD_NEW_ORDER_SECTION_FULL,
  ORDER_ADD_NEW_ORDER_PROFILE_NOT_COMPLETED,
  ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE,
  ORDER_ADD_NEW_ORDER_SELLER_OFFLINE,
  ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM,
  ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND,
  ORDER_ADD_NEW_ORDER_NO_CART_ITEM,
  ORDER_ADD_NEW_ORDER_CART_NEED_SYNC,
  UPDATE_ORDER_STATE_INVALID_STATE,
  ORDER_CANCEL_ORDER_SELLER_OFFLINE,
  ORDER_CANCEL_ORDER_INVALID_STATE,
  RATE_ORDER_INVALID_ORDER_STATE,
  RATE_ORDER_INVALID_USER,
  CONFIRM_ORDER_DELIVERED_NOT_SHIPPED,
  CONFIRM_ORDER_DELIVERED_INVALID_DELIVERER
} = require("../responses/ResponseMessage");

const placeOrder = async (req, res) => {
  const userId = req.currentUser.uid;
  const userDetail = req.userDetail;
  const paymentMethod = req.body.payment_method;
  const message = req.body.message;

  const [userCart, cartItems] = await Promise.all([
    UserCart.get(userId),
    CartItem.getAll(userId)
  ]);

  const sellerId = userCart.seller_id;
  const sellerType = userCart.seller_type;
  const sectionId = userCart.section_id;

  const sellerDetail = await Seller.getDetail(sellerId);

  // Ensure the user has filled in his profile
  if (!userDetail.roles.includes(UserRole.USER) || !userDetail.name || !userDetail.phone_num) {
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
    const itemDetail = await SellerItem.getDetailWith(sellerId, itemId);
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
  const sectionDetail = sectionId ? await SellerSection.getDetail(sectionId) : null;

  if (sectionId) {
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

    // Ensure the section is not full yet.
    if (sectionDetail.joined_users_count >= sectionDetail.max_users) {
      return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_SECTION_FULL);
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
    };
  });

  // Create a new order
  const newOrderDoc = Order.createDoc();
  const newOrderId = newOrderDoc.id;
  const newOrderIdentifier = generateIdentifier(5);
  const newOrderType = sellerType === SellerType.ON_CAMPUS ? OrderType.ON_CAMPUS : OrderType.OFF_CAMPUS;

  const newOrderDetail = {
    title:                  userCart.title,
    title_zh:               userCart.title_zh,
    user_id:                userId,
    seller_id:              sellerId,
    seller_name:            sellerDetail.name,
    seller_name_zh:         sellerDetail.name_zh,
    identifier:             newOrderIdentifier,
    image_url:              userCart.image_url,
    type:                   newOrderType,
    order_items:            orderItems,
    order_items_count:      orderItems.length,
    state:                  OrderState.PROCESSING,
    is_paid:                false,
    payment_method:         paymentMethod,
    message:                message,
    delivery_location:      sectionId ? sectionDetail.delivery_location : sellerDetail.location,
    subtotal_cost:          userCart.subtotal_cost,
    delivery_cost:          userCart.delivery_cost,
    total_cost:             userCart.total_cost,
    verify_code:            uuidv4()
  };

  // Fields for off-campus order
  if (sectionId) {
    const newOrderSectionTitle = sectionDetail ? sectionDetail.title : null;
    const newOrderSectionTitleZh = sectionDetail ? sectionDetail.title_zh : null;

    Object.assign(newOrderDetail, {
      section_id:             sectionId,
      section_title:          newOrderSectionTitle,
      section_title_zh:       newOrderSectionTitleZh,
    });
  }

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
  const userDetail = req.userDetail;

  const orderDetail = await Order.getDetail(orderId);
  const sellerDetail = await Seller.getDetail(orderDetail.seller_id);

  // Check if the seller is online
  if (!sellerDetail.online) {
    return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_SELLER_OFFLINE);
  }

  // Check if the order is already cancelled.
  if (orderDetail.state === OrderState.CANCELLED) {
    return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_INVALID_STATE);
  }

  // Seller can cancel order before archived state.
  if (userDetail.roles.includes(UserRole.SELLER)) {
    if (orderDetail.state === OrderState.ARCHIVED) {
      return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_INVALID_STATE);
    }
  }

  // User can only cancel order during processing state.
  if (userDetail.roles.includes(UserRole.USER)) {
    if (orderDetail.state !== OrderState.PROCESSING) {
      return sendErrorResponse(res, 403, ORDER_CANCEL_ORDER_INVALID_STATE);
    }
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

const confirmOrderDelivered = async (req, res) => {
  const orderId = req.body.order_id;
  const userId = req.currentUser.uid;

  // Verify seller or deliverer
  const orderDetail = await Order.getDetail(orderId);

  if (orderDetail.seller_id !== userId &&
      orderDetail.deliverer_id !== userId) {
    return sendErrorResponse(res, 403, CONFIRM_ORDER_DELIVERED_INVALID_DELIVERER);
  }

  // Check if the current section is in transit
  if (orderDetail.state !== OrderState.READY_FOR_PICK_UP) {
    return sendErrorResponse(res, 403, CONFIRM_ORDER_DELIVERED_NOT_SHIPPED);
  }

  // Confirm order delivered
  await Order.updateDetail(orderId, {
    is_paid: true,
    state: OrderState.DELIVERED
  });

  return sendSuccessResponse(res);
};

const rateOrder = async (req, res) => {
  const userId = req.currentUser.uid;
  const userDetail = req.userDetail;

  const orderId = req.body.order_id;
  const orderRating = req.body.order_rating;
  const deliveryRating = req.body.delivery_rating;

  // Find the seller id of the order
  const orderDetail = await Order.getDetail(orderId);
  const sellerId = orderDetail.seller_id;

  // Check if the rating is submitted by the order owner
  if (orderDetail.user_id !== userId) {
    return sendErrorResponse(res, 403, RATE_ORDER_INVALID_USER);
  }

  // Check if the order is in delivered state
  if (orderDetail.state !== OrderState.DELIVERED) {
    return sendErrorResponse(res, 403, RATE_ORDER_INVALID_ORDER_STATE);
  }

  // Cannot add delivery rating for on-campus order
  if (orderDetail.type === OrderType.ON_CAMPUS && deliveryRating) {
    return sendErrorResponse(res, 403, RATE_ORDER_INVALID_RATING);
  }

  // Set to archived state
  const ratingPromises = [
    Rating.createDetail(sellerId, {
      username: userDetail.username,
      user_photo_url: userDetail.photo_url,
      order_id: orderId,
      order_rating: orderRating,
      delivery_rating: deliveryRating
    }),
    Order.updateDetail(orderId, {
      state: OrderState.ARCHIVED
    })
  ];

  await Promise.all(ratingPromises);

  return sendSuccessResponse(res);
};

module.exports = {
  placeOrder,
  cancelOrder,
  updateOrderState,
  confirmOrderDelivered,
  rateOrder
}