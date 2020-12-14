const {USERS_COLLECTION} = require("../../constants");
const { USER_CARTS_COLLECTION, SELLERS_COLLECTION } = require("../../constants");
const { db, admin } = require('../../config');

const DELIVERY_COST = 20;

/**
 * Update the 'user_carts' fields when a cart item is written
 * in 'cart_items'.
 */
module.exports = async function updateUserCartInfoTask(change, context) {
  const userId = context.params.userId;

  let userCart            = {};
  let cartSellerId        = null;
  let cartSellerType      = null;
  let cartItemsCount      = 0;
  let cartSubtotalCost    = 0;
  let cartDeliveryCost    = 0;
  let cartTotalCost       = 0;

  // Get all remaining cart items
  const cartItems = (await change.after.ref.parent.get())
    .docs
    .map(doc => doc.data());

  if (cartItems.length > 0) {
    cartItemsCount  = cartItems.length;
    cartSellerId    = cartItems[0].item_seller_id;

    // Get seller info
    const seller = (await db.collection(SELLERS_COLLECTION)
      .doc(cartSellerId)
      .get())
      .data();

    cartSellerType = seller.type;

    // Calculate subtotal cost
    cartItems.forEach(item => cartSubtotalCost += item.total_price);

    // Calculate delivery cost
    cartDeliveryCost = cartSellerType === 0 ? 0 : DELIVERY_COST;

    // Calculate total cost
    cartTotalCost = cartSubtotalCost + cartDeliveryCost;
  } else {
    // Ignore when there is no more cart item
    Object.assign(userCart, {
      sync_required:  false
    });
  }

  Object.assign(userCart, {
    seller_id:      cartSellerId,
    seller_type:    cartSellerType,
    items_count:    cartItemsCount,
    subtotal_cost:  cartSubtotalCost,
    delivery_cost:  cartDeliveryCost,
    total_cost:     cartTotalCost,
    updated_at:     admin.firestore.FieldValue.serverTimestamp()
  });

  return await db.collection(USER_CARTS_COLLECTION)
    .doc(userId)
    .set(userCart, { merge: true });
}