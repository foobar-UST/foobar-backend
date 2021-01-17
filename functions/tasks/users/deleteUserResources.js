const User = require("../../models/User");
const CartItem = require("../../models/CartItem");
const UserCart = require("../../models/UserCart");
const Suggest = require("../../models/Suggest");

/**
 * Clean up the resources when a user is deleted from Auth.
 */
module.exports = async function deleteUserResourcesTask(user) {
  const userId = user.uid;

  await Promise.all([
    User.deletePhoto(userId),
    Suggest.deleteAllBasic(userId),
    CartItem.deleteAll(userId),
    UserCart.delete(userId)
  ]);

  return await User.deleteUser(userId);
};