const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Seller = require("../../models/Seller");
const SellerSection = require("../../models/SellerSection");
const SellerItem = require("../../models/SellerItem");
const generateIdentifier = require("../../utils/generateIdentifier");
const Order = require("../../models/Order");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { admin } = require("../../config");
const { ORDER_STATE_PROCESSING } = require("../../constants");
const { validationResult } = require("express-validator");
const { sendErrorResponse } = require("../responses/sendResponse");
const { v4: uuidv4 } = require('uuid');
const { INVALID_REQUEST_PARAMS } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_PROFILE_NOT_COMPLETED } = require("../responses/ResponseMessage");
const { USER_ROLES_USER } = require("../../constants");
const { ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE } = require("../responses/ResponseMessage");
const { SELLER_SECTION_STATE_AVAILABLE } = require("../../constants");
const { ORDER_ADD_NEW_ORDER_SELLER_OFFLINE } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_NO_CART_ITEM } = require("../responses/ResponseMessage");
const { ORDER_ADD_NEW_ORDER_CART_NEED_SYNC } = require("../responses/ResponseMessage");

const addNewOrder = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }

  const userId          = req.currentUser.uid;
  const userDetail      = req.userDetail;
  const paymentMethod   = req.body.payment_method;
  const message         = req.body.message;

  const userCart        = await UserCart.get(userId);
  const cartItems       = await CartItem.getAll(userId);

  let sellerDetail;
  let sectionDetail;

  const sellerId        = userCart.seller_id;
  const sellerType      = userCart.seller_type;
  const groupSectionId  = userCart.seller_section_id;

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

  if (!itemDetails.every(item => item.count > 0)) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM);
  }

  // Ensure all items are from the same seller
  if (!itemDetails.every(item => item.seller_id === itemDetails[0].seller_id)) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_UNAVAILABLE_ITEM);
  }

  sellerDetail = await Seller.getDetail(sellerId);

  // Ensure the total cost of the order is greater than the minimum spend requirement of the seller
  if (userCart.total_cost < sellerDetail.min_spend) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_LESS_THAN_MIN_SPEND);
  }

  // Ensure the seller is online
  if (!sellerDetail.online) {
    return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_SELLER_OFFLINE);
  }

  if (groupSectionId) {
    sectionDetail = await SellerSection.getDetail(sellerId, groupSectionId);
    // Ensure the group order section is still available
    if (sectionDetail.state !== SELLER_SECTION_STATE_AVAILABLE) {
      return sendErrorResponse(res, 403, ORDER_ADD_NEW_ORDER_SECTION_UNAVAILABLE);
    }
  }

  // Insert a new order
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
  const newOrderDetail = {
    user_id:                userId,
    seller_id:              sellerId,
    deliverer_id:           null,
    identifier:             generateIdentifier(5),
    type:                   sellerType,
    order_items:            orderItems,
    state:                  ORDER_STATE_PROCESSING,
    is_paid:                true,
    payment_method:         paymentMethod,
    message:                message,
    delivery_location:      sectionDetail ? sectionDetail.delivery_location : sellerDetail.location.address,
    delivery_location_zh:   sectionDetail ? sectionDetail.delivery_location_zh : sellerDetail.location.address_zh,
    subtotal_cost:          userCart.subtotal_cost,
    delivery_cost:          userCart.delivery_cost,
    total_cost:             userCart.total_cost,
  };

  await Order.createDetail(newOrderDetail);

  // Decrement the count of all items
  const decrementJobs = [];
  decrementJobs.push(cartItems.map(cartItem => {
    return SellerItem.updateDetail(sellerId, cartItem.item_id, {
      count:  admin.firestore.FieldValue.increment(-cartItem.amounts)
    });
  }));

  await Promise.all(decrementJobs);

  // Clear all cart items
  await CartItem.deleteAll(userId);

  return sendSuccessResponse(res);
};

const updateOrderState = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }
};

module.exports = {
  addNewOrder,
  updateOrderState
}