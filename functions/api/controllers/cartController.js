const { admin } = require('../../config');
const { INVALID_REQUEST_PARAMS } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_SOLD_OUT_ERROR } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_INVALID_SELLER_ERROR } = require("../routes/ResponseMessage");
const { REDUCE_USER_CART_ITEM_NOT_FOUND } = require("../routes/ResponseMessage");
const { validationResult } = require('express-validator');
const UserCartItem = require("../../models/UserCartItem");
const UserCart = require("../../models/UserCart");
const SellerItem = require("../../models/SellerItem");
const Seller = require("../../models/Seller");

// TODO: a bit slow to add item
// Remove index if changed
const addUserCartItem = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: INVALID_REQUEST_PARAMS });
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
    return res.status(500).json({ message: err.message });
  }

  // Get seller detail
  let seller;
  try {
    seller = await Seller.getDetail(sellerId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Get UserCart info
  let userCart;
  try {
    userCart = await UserCart.get(userId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Reject the operation when a user attempts to add a new cart item
  // from a different seller
  if (userCart !== null && userCart.seller_id !== null && userCart.seller_id !== sellerId) {
    return res.status(403).json({ message: ADD_USER_CART_ITEM_INVALID_SELLER_ERROR });
  }

  // Reject the operation when the item is unavailable or sold out
  if (!item.available || item.count < amounts) {
    return res.status(403).json({ message: ADD_USER_CART_ITEM_SOLD_OUT_ERROR });
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
    return res.status(500).json({ message: err.message });
  }

  // TODO: Update the amounts of remaining items (after placing order)

  return res.status(200).json();
};

const reduceUserCartItem = async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: INVALID_REQUEST_PARAMS });
  }

  const userId      = req.currentUser.uid;
  const cartItemId  = req.body.cart_item_id;

  // Get CartItem info
  let cartItem;
  try {
    cartItem = await UserCartItem.get(userId, cartItemId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  // Check if the cart item exists
  if (cartItem === null) {
    return res.status(403).json({ message: REDUCE_USER_CART_ITEM_NOT_FOUND });
  }

  // Decrement the amount of the item and update the accumulated price,
  // or delete it where there is no more left
  try {
    if (cartItem.amounts > 1) {
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
    return res.status(500).json({ message: err.message });
  }

  return res.status(200).json();
};

module.exports = {
  addUserCartItem,
  reduceUserCartItem
}