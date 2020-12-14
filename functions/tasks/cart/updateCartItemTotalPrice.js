const { admin } = require('../../config');

/**
 * Update the 'total_price' field of each modified 'cart_item',
 * e.g. when the amount is incremented or decremented,
 * the update will carry out only if 'update_price_required' field is
 * set to true to prevent infinite loop.
 */
module.exports = async function updateCartItemTotalPrice(change, context) {
  const document = change.after.exists ? change.after.data() : null;

  // Ignore when the cart item is deleted
  if (document === null) {
    return true;
  }

  // Ignore when price is already up to date
  if (document.update_price_required === null ||
      document.update_price_required === false
  ) {
    return true;
  }

  // Calculate new total price
  const newTotalPrice = document.amounts * document.item_price;

  return await change.after.ref
    .update({
      total_price:            newTotalPrice,
      update_price_required:  false,
      updated_at:             admin.firestore.FieldValue.serverTimestamp()
    });
};