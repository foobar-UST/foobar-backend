const User = require("../../models/User");
const UserCartItem = require("../../models/UserCartItem");
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
    UserCartItem.deleteAll(userId),
    UserCart.delete(userId)
  ]);

  return await User.deleteUser(userId);
};