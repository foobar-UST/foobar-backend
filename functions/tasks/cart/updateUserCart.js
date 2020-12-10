const { db, admin } = require('../../config');
const { 
  USERS_COLLECTION,
  USER_CART_ITEMS_SUB_COLLECTION, 
  SELLERS_COLLECTION, 
  USER_CARTS_COLLECTION } = require('../../constants');

/**
 * This function has several uses:
 * 1. Calculate the total_price of each cart_item, it will trigger when
 *    there is any changes in cart_items and the update_price_required flag is set to true.
 * 2. Update the user_carts information such as the subtotal, delivery cost, etc.
 *    It will trigger when there is any changes in cart_items.
 * 3. Clear the sync_required flag in user_carts when there is no more cart_items left.
 *    It will trigger when there is any changes in cart_items and the no of cart items
 *    is zero.
 */
module.exports = async function updateUserCartTask(change, context) {
  const cartItem = change.after.exists ? change.after.data() : null;
  const userId = context.params.userId;
  const cartItemId = context.params.cartItemId;

  /*--- 1. Update cart item total price ---*/
  if (cartItem !== null) {
    if (cartItem.update_price_required !== null && cartItem.update_price_required === true) {
      const newTotalPrice = cartItem.amounts * cartItem.item_price;

      try {
        await change.after.ref
          .update({
            total_price: newTotalPrice,
            update_price_required: false,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
         });
  
        console.log(`[Success] Updated cart item: ${cartItemId}.`);
      } catch (err) {
        console.log(`[Error] Failed to update cart item: ${err}`);
      }
    }
  }

  /*--- 2. Update user cart fields ---*/
  // Fields to update
  let userCart = {};
  let cartSellerId      = null;
  let cartSellerType    = null;
  let cartItemsCount    = 0;
  let cartSubtotalCost  = 0;
  let cartDeliveryCost  = 0;
  let cartTotalCost     = 0;

  // Get all cart items for the user.
  // If the cart is empty, clear the related fields.
  let cartItems;
  try {
    const snapshot = await db.collection(USERS_COLLECTION)
      .doc(userId)
      .collection(USER_CART_ITEMS_SUB_COLLECTION)
      .get();

    cartItems = snapshot.docs.map(doc => doc.data());

    // Get no of cart items
    cartItemsCount = cartItems.length;
  } catch (err) {
    console.log(`[Error] Failed to retrieve 'cart_items': ${err}`);
    return false;
  }

  // Get seller info and calculate total cost when there is cart items
  if (cartItems.length > 0) {
    // Get seller info
    let seller;
    cartSellerId = cartItems[0].item_seller_id;
  
    try {
      const snapshot = await db.collection(SELLERS_COLLECTION)
        .doc(cartSellerId)
        .get();

      seller = snapshot.data();
    } catch (err) {
      console.log(`[Error] Error getting seller: ${err}`);
      return false;
    }

    cartSellerType = seller.type;

    // Subtotal cost
    cartItems.forEach(item => {
      cartSubtotalCost += item.total_price;
    });

    // Delivery cost
    cartDeliveryCost = seller.type === 0 ? 0 : 20;

    // Total cost
    cartTotalCost = cartSubtotalCost + cartDeliveryCost;
  } else {
    /*---- 3. When there is no more cart item, set 'sync_required' field to false ----*/
    Object.assign(userCart, {
      sync_required: false 
    });
  }

  // Update or create user_carts
  Object.assign(userCart, { 
    seller_id: cartSellerId,
    seller_type: cartSellerType,
    items_count: cartItemsCount,
    subtotal_cost: cartSubtotalCost,
    delivery_cost: cartDeliveryCost,
    total_cost: cartTotalCost,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });

  return db.collection(USER_CARTS_COLLECTION)
    .doc(userId)
    .set(userCart, { merge: true })
    .then(() => {
      console.log(`[Success] Updated 'user_carts' for: ${userId}`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to update 'user_carts': ${err}`);
    });
};