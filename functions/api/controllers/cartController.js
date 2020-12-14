const { admin } = require('../../config');
const { MISSING_REQUIRED_PARAMS } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_NO_REMAINING_ERROR } = require("../routes/ResponseMessage");
const { ADD_USER_CART_ITEM_INVALID_SELLER_ERROR } = require("../routes/ResponseMessage");
const { REDUCE_USER_CART_ITEM_NOT_FOUND } = require("../routes/ResponseMessage");
const { validationResult } = require('express-validator');
const UserCartItem = require("../models/UserCartItem");
const UserCart = require("../models/UserCart");
const SellerItem = require("../models/SellerItem");
const Seller = require("../models/Seller");

const addUserCartItem = async (req, res) => {
  /*---- Get parameters ----*/
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: MISSING_REQUIRED_PARAMS });
  }

  const userId    = req.currentUser.uid;
  const itemId    = req.body.item_id;
  const amounts   = req.body.amounts;

  /*---- Get item ----*/
  let sellerItem;
  try {
    sellerItem = await SellerItem.get(itemId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  /*---- Get seller ----*/
  let seller;
  try {
    seller = await Seller.getDetail(sellerItem.seller_id);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  /*---- Get user cart info ----*/
  let userCart;
  try {
    userCart = await UserCart.get(userId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  /*---- Check if the seller of the new cart item is the same as the seller
  in the existing order ----*/
  if (userCart !== null && userCart.seller_id !== null && userCart.seller_id !== sellerItem.seller_id) {
    return res.status(403).json({ message: ADD_USER_CART_ITEM_INVALID_SELLER_ERROR });
  }

  /*---- Check if there is the seller item is available ----*/
  if (!sellerItem.available || sellerItem.count < amounts) {
    return res.status(403).json({ message: ADD_USER_CART_ITEM_NO_REMAINING_ERROR });
  }

  /*---- Insert the cart item ----*/
  let result;

  try {
    result = await UserCartItem.create(userId, {
      item_id:              itemId,
      item_seller_id:       seller.id,
      item_title:           sellerItem.title,
      item_title_zh:        sellerItem.title_zh,
      item_price:           sellerItem.price,
      item_image_url:       sellerItem.image_url,
      amounts:              amounts,
      total_price:          amounts * sellerItem.price,
      updated_at:           admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  /*---- Update the amounts of remaining seller item ----*/
  try {
    await SellerItem.update(sellerItem.seller_id, itemId, {
      count: admin.firestore.FieldValue.increment(-amounts)
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  return res.status(200).json(result);
};

const reduceUserCartItem = async (req, res) => {
  /*---- Get parameters ----*/
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ message: MISSING_REQUIRED_PARAMS });
  }

  const userId      = req.currentUser.uid;
  const cartItemId  = req.body.cart_item_id;

  /*---- Get cart item ----*/
  let cartItem;
  try {
    cartItem = await UserCartItem.get(userId, cartItemId);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (cartItem === null) {
    return res.status(403).json({ message: REDUCE_USER_CART_ITEM_NOT_FOUND });
  }

  /*---- Decrement the amounts or delete the cart item ----*/
  try {
    if (cartItem.amounts > 1) {
      await UserCartItem.update(userId, cartItemId, {
        amounts: admin.firestore.FieldValue.increment(-1)
      });
    } else {
      await UserCartItem.delete(userId, cartItemId);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  /*---- Update user cart info's total cost ----*/


  return res.status(200).json();
};

module.exports = {
  addUserCartItem,
  reduceUserCartItem
}