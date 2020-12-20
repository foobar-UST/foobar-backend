const { INVALID_REQUEST_PARAMS } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_SOLD_OUT_ERROR } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_INVALID_SELLER_ERROR } = require("../routes/ResponseMessage");
const { REDUCE_USER_CART_ITEM_NOT_FOUND } = require("../routes/ResponseMessage");
const { validationResult } = require('express-validator');
const UserCartItem = require("../../models/UserCartItem");
const UserCart = require("../../models/UserCart");
const SellerItem = require("../../models/SellerItem");
const Seller = require("../../models/Seller");
const { SYNC_USER_CART_ITEMS_UP_TO_DATE } = require("../routes/ResponseMessage");
const { sendSuccessResponse } = require("../responses/sendResponse");
const { sendErrorResponse } = require("../responses/sendResponse");

const addUserCartItem = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }

  const userId    = req.currentUser.uid;
  const sellerId  = req.body.seller_id;
  const itemId    = req.body.item_id;
  const amounts   = req.body.amounts;

  // Get item detail
  let item;
  try {
    item = await SellerItem.getDetail(sellerId, itemId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Get seller detail
  let seller;
  try {
    seller = await Seller.getDetail(sellerId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Get UserCart info
  let userCart;
  try {
    userCart = await UserCart.get(userId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Reject the operation when a user attempts to add a new cart item
  // from a different seller
  if (userCart !== null && userCart.seller_id !== null && userCart.seller_id !== sellerId) {
    return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_INVALID_SELLER_ERROR);
  }

  // Reject the operation when the item is unavailable or sold out
  if (!item.available || item.count < amounts) {
    return sendErrorResponse(res, 403, ADD_USER_CART_ITEM_SOLD_OUT_ERROR);
  }

  // Check if the new cart item already exist in the user cart,
  // if yes, simply increment the amounts, if not, create a new one.
  try {
    const existing = await UserCartItem.findDocByItemId(userId, itemId);

    if (existing === null) {
      const newTotalPrice = amounts * item.price;

      await UserCartItem.create(userId, {
        item_id:              itemId,
        item_seller_id:       seller.id,
        item_title:           item.title,
        item_title_zh:        item.title_zh,
        item_price:           item.price,
        item_image_url:       item.image_url,
        available:            true,
        amounts:              amounts,
        total_price:          newTotalPrice
      });
    } else {
      const newAmounts = existing.data().amounts + amounts;
      const newTotalPrice = newAmounts * item.price;

      await UserCartItem.update(userId, existing.id, {
        amounts:              newAmounts,
        total_price:          newTotalPrice
      });
    }
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // TODO: Update the amounts of remaining items (after placing order)
  return sendSuccessResponse(res);
};

const reduceUserCartItem = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return sendErrorResponse(res, 400, INVALID_REQUEST_PARAMS);
  }

  const userId      = req.currentUser.uid;
  const cartItemId  = req.body.cart_item_id;

  // Get CartItem info
  let cartItem;
  try {
    cartItem = await UserCartItem.get(userId, cartItemId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Check if the cart item exists
  if (cartItem === null) {
    return sendErrorResponse(res, 403, REDUCE_USER_CART_ITEM_NOT_FOUND);
  }

  // Decrement the amount of the item and update the accumulated price,
  // or delete it where there is no more left
  try {
    if (cartItem.amounts > 1 && cartItem.available) {
      const newAmounts      = cartItem.amounts - 1;
      const newTotalPrice   = newAmounts * cartItem.item_price;

      await UserCartItem.update(userId, cartItemId, {
        amounts:      newAmounts,
        total_price:  newTotalPrice
      });
    } else {
      await UserCartItem.delete(userId, cartItemId);
    }
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  return sendSuccessResponse(res);
};

const clearUserCart = async (req, res) => {
  const userId = req.currentUser.uid;

  try {
    await UserCartItem.deleteAll(userId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  return sendSuccessResponse(res);
};

const syncUserCartItems = async (req, res) => {
  const userId      = req.currentUser.uid;

  // Get user cart
  let userCart;
  try {
    userCart = await UserCart.get(userId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Check if the cart requires synchronization
  if (userCart.sync_required !== true) {
    return sendErrorResponse(res, 403, SYNC_USER_CART_ITEMS_UP_TO_DATE);
  }

  // Get all cart items
  let cartItems;
  try {
    cartItems = await UserCartItem.getAll(userId);
  } catch (err) {
    return sendErrorResponse(res, 500, err.message);
  }

  // Sync with seller items
  const syncAction = async (cartItem) => {
    // Get seller item
    let item;
    try {
      item = await SellerItem.getDetail(cartItem.item_seller_id, cartItem.item_id);
    } catch (err) {
      return sendErrorResponse(res, 500, err.message);
    }

    // If the seller item is removed, unavailable, out-of-stock,
    // set available field to false
    if (item === null || !item.available || item.count < cartItem.amounts) {
      return await UserCartItem.update(userId, cartItem.id, {
        available:  false
      });
    }

    // Copy data from seller item to cart item
    return await UserCartItem.update(userId, cartItem.id, {
      item_title:           item.title,
      item_title_zh:        item.title_zh,
      item_price:           item.price,
      item_image_url:       item.image_url,
      total_price:          cartItem.amounts * item.price
    });
  };

  await Promise.all(cartItems.map(cartItem => syncAction(cartItem)));

  // Set sync_required to false when completed
  await UserCart.update(userId, {
    sync_required: false
  });

  return sendSuccessResponse(res);
};

module.exports = {
  addUserCartItem,
  reduceUserCartItem,
  clearUserCart,
  syncUserCartItems
}