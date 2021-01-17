const Seller = require("../../models/Seller");
const UserCart = require("../../models/UserCart");

const DELIVERY_COST = 20;

/**
 * Update the 'user_carts' info when a cart item is modified in 'cart_items'.
 */
module.exports = async function updateUserCartTask(change, context) {
  //const cartItem = change.after.exists ? change.after.data() : null;
  const userId = context.params.userId;

  // Fields to update
  let userCart            = {};
  let cartSellerId        = null;
  let cartSectionId       = null;
  let cartSellerType      = null;
  let cartItemsCount      = 0;
  let cartSubtotalCost    = 0;
  let cartDeliveryCost    = 0;
  let cartTotalCost       = 0;

  // Get all remaining cart items
  const snapshot = await change.after.ref.parent.get();
  const cartItems = snapshot.docs.map(doc => doc.data());

  if (cartItems.length <= 0) {
    // Return if the cart is empty
    //Object.assign(userCart, { sync_required: false });
  } else {
    cartItemsCount  = cartItems.length;
    cartSellerId    = cartItems[0].item_seller_id;
    cartSectionId   = cartItems[0].item_section_id;

    // Get seller type
    const seller = await Seller.getDetail(cartSellerId);
    cartSellerType = seller.type;

    // Calculate the costs
    cartItems.forEach(item => cartSubtotalCost += item.total_price);
    cartDeliveryCost = cartSellerType === 0 ? 0 : DELIVERY_COST;    // Free-of-charge for on-campus order
    cartTotalCost = cartSubtotalCost + cartDeliveryCost;
  }

  Object.assign(userCart, {
    seller_id:      cartSellerId,
    seller_type:    cartSellerType,
    section_id:     cartSectionId,
    items_count:    cartItemsCount,
    subtotal_cost:  cartSubtotalCost,
    delivery_cost:  cartDeliveryCost,
    total_cost:     cartTotalCost
  });

  return await UserCart.upsert(userId, userCart);
}