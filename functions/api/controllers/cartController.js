const { admin } = require('../../config');
const { SectionState } = require("../../models/SectionState");
const { isSameDay } = require("../../utils/DateUtils");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { sendErrorResponse } = require("../responses/sendResponse");
const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const SellerItem = require("../../models/SellerItem");
const Seller = require("../../models/Seller");
const SellerSection = require("../../models/SellerSection");
const { REDUCE_USER_CART_ITEM_NOT_FOUND,
  ADD_USER_CART_ITEM_SOLD_OUT_ERROR,
  ADD_USER_CART_ITEM_INVALID_SELLER_ERROR,
  ADD_USER_CART_ITEM_INVALID_SECTION_ERROR,
  ADD_USER_CART_SECTION_UNAVAILABLE,
  ADD_USER_CART_ITEM_SELLER_OFFLINE,
  SYNC_USER_CART_UP_TO_DATE
} = require('../responses/ResponseMessage');

const addUserCartItem = async (req, res) => {
  const userId          = req.currentUser.uid;
  const itemSectionId   = req.body.section_id;
  const itemId          = req.body.item_id;
  const amounts         = req.body.amounts;

  const [sellerDetail, sectionDetail] = await Promise.all([
    Seller.getDetailHavingItem(itemId),
    SellerSection.getDetail(itemSectionId)
  ]);

  const [itemDetail, userCart] = await Promise.all([
    SellerItem.getDetail(sellerDetail.id, itemId),
    UserCart.get(userId)
  ]);

  // Reject if the seller is offline
  if (!sellerDetail.online) {
    return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_SELLER_OFFLINE);
  }

  // Reject if the user attempts to add a new cart item from a different seller
  if (userCart && userCart.seller_id && userCart.seller_id !== sellerDetail.id) {
    return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_INVALID_SELLER_ERROR);
  }

  // Validate section cart item
  if (sectionDetail) {
    const timestampNow = admin.firestore.Timestamp.now();
    const isSectionAvailable = sectionDetail.available &&
      sectionDetail.state === SectionState.AVAILABLE &&
      sectionDetail.cutoff_time > timestampNow &&
      sectionDetail.delivery_time > timestampNow &&
      isSameDay(timestampNow.toDate(), sectionDetail.delivery_time.toDate());

    // Reject if the off-campus section is not ready.
    if (!isSectionAvailable) {
      return sendErrorResponse(res, 403, ADD_USER_CART_SECTION_UNAVAILABLE);
    }

    // Reject if the user attempts to add a new cart item from a different section
    if (userCart && userCart.section_id && userCart.section_id !== itemSectionId) {
      return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_INVALID_SECTION_ERROR);
    }
  }

  // Reject if the item is unavailable or not having enough quantity
  if (!itemDetail.available || itemDetail.count < amounts) {
    return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_SOLD_OUT_ERROR);
  }

  // Check if the new cart item already exist in the user cart,
  // if yes, simply increment the amounts, if not, create a new one.
  const existingCartItem = await CartItem.findDocByItemId(userId, itemId);

  if (!existingCartItem) {
    const newTotalPrice = amounts * itemDetail.price;

    await CartItem.create(userId, {
      user_id:              userId,
      item_id:              itemId,
      item_seller_id:       sellerDetail.id,
      item_section_id:      itemSectionId,
      item_title:           itemDetail.title,
      item_title_zh:        itemDetail.title_zh,
      item_price:           itemDetail.price,
      item_image_url:       itemDetail.image_url,
      available:            true,
      amounts:              amounts,
      total_price:          newTotalPrice
    });
  } else {
    const newAmounts = existingCartItem.data().amounts + amounts;
    const newTotalPrice = newAmounts * itemDetail.price;

    await CartItem.update(userId, existingCartItem.id, {
      amounts:              newAmounts,
      total_price:          newTotalPrice
    });
  }

  return sendSuccessResponse(res);
};

const updateUserCartItem = async (req, res) => {
  const userId      = req.currentUser.uid;
  const cartItemId  = req.body.cart_item_id;
  const newAmounts  = req.body.amounts;

  const cartItem    = await CartItem.get(userId, cartItemId);

  // Check if the cart item exists
  if (!cartItem) {
    return sendErrorResponse(res, 403, REDUCE_USER_CART_ITEM_NOT_FOUND);
  }

  // Update the amount of the item and update the accumulated price,
  // or delete it where there is no more left.
  if (newAmounts <= 0 || !cartItem.available) {
    await CartItem.delete(userId, cartItemId);
  } else {
    const newTotalPrice = newAmounts * cartItem.item_price;
    await CartItem.update(userId, cartItemId, {
      amounts:      newAmounts,
      total_price:  newTotalPrice
    });
  }

  return sendSuccessResponse(res);
};

const clearUserCart = async (req, res) => {
  const userId = req.currentUser.uid;
  await CartItem.deleteAllForUser(userId);
  return sendSuccessResponse(res);
};

const syncUserCart = async (req, res) => {
  const userId = req.currentUser.uid;

  // Check if the cart requires synchronization
  const userCart = await UserCart.get(userId);
  if (!userCart || !userCart.sync_required) {
    return sendErrorResponse(res, 403, SYNC_USER_CART_UP_TO_DATE);
  }

  // Sync all cart items
  const cartItems = await CartItem.getAll(userId);
  const syncItemAction = async (cartItem) => {
    const itemDetail = await SellerItem.getDetail(cartItem.item_seller_id, cartItem.item_id);

    // If the seller item is removed, unavailable, out-of-stock,
    // set 'available' field to false. User is expected to remove the item
    // on their own.
    if (!itemDetail || !itemDetail.available || itemDetail.count < cartItem.amounts) {
      return CartItem.update(userId, cartItem.id, { available: false });
    }

    // If the seller item is available,
    // copy the data from seller item.
    return CartItem.update(userId, cartItem.id, {
      item_title: itemDetail.title,
      item_title_zh: itemDetail.title_zh,
      item_price: itemDetail.price,
      item_image_url: itemDetail.image_url,
      total_price: cartItem.amounts * itemDetail.price
    });
  };

  const syncItemJobs = cartItems.map(cartItem => syncItemAction(cartItem));
  await Promise.all(syncItemJobs);

  // Sync user cart info, and reset 'sync_required'.
  const [sellerDetail, sectionDetail] = await Promise.all([
    Seller.getDetail(userCart.seller_id),
    SellerSection.getDetail(userCart.section_id)
  ]);

  const cartTitle = sectionDetail ? sectionDetail.title : sellerDetail.name;
  const cartTitleZh = sectionDetail ? sectionDetail.title_zh : sellerDetail.name_zh;
  const cartImageUrl = sectionDetail ? sectionDetail.image_url : sellerDetail.image_url;
  const deliveryTime = sectionDetail ? sectionDetail.delivery_time : null;
  const pickupLocation = sectionDetail ? sectionDetail.delivery_location : sellerDetail.location;

  // Set sync_required to false when completed
  await UserCart.update(userId, {
    title: cartTitle,
    title_zh: cartTitleZh,
    image_url: cartImageUrl,
    delivery_time: deliveryTime,
    pickup_location: pickupLocation,
    sync_required: false
  });

  return sendSuccessResponse(res);
};

module.exports = {
  addUserCartItem,
  updateUserCartItem,
  clearUserCart,
  syncUserCart
}