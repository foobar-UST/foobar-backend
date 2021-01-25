const User = require("../../models/User");
const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Suggest = require("../../models/Suggest");
const Seller = require("../../models/Seller");

/**
 * Clean up the resources when a user is deleted from Auth.
 */
module.exports = async function deleteUserResourcesTask(user) {
  const userId = user.uid;

  await Promise.all([
    User.deletePhoto(userId),
    CartItem.deleteAllForUser(userId),
    UserCart.delete(userId),
    Seller.detachFromUser(userId)
    // TODO: Suggest.deleteAllBasic(userId),
  ]);

  return await User.deleteUser(userId);
};