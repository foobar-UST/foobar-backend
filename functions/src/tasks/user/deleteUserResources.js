const User = require("../../models/User");
const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Seller = require("../../models/Seller");
const Rating = require("../../models/Rating");

/**
 * Clean up the resources when a user is deleted from Auth.
 */
module.exports = async function deleteUserResourcesTask(user) {
  const userId = user.uid;

  await Promise.all([
    User.deletePhoto(userId),
    CartItem.deleteAllForUser(userId),
    UserCart.deleteFor(userId),
    Seller.detachFromUser(userId),
    Rating.deleteFor(userId)
  ]);

  return await User.deleteUser(userId);
};