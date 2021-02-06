const User = require("../../models/User");

/**
 * Link 'user' collection with 'users_public' and 'users_delivery' collections.
 * 1. Link deletion
 * 2. Link update
 */
module.exports = async function linkUsersPublicDeliveryTask(change, context) {
  const user = change.after.exists ? change.after.data() : null;
  const userId = context.params.userId;

  // Delete user documents
  if (user === null) {
    return await Promise.all([
      User.deletePublic(userId),
      User.deleteDelivery(userId)
    ]);
  }

  // Update user documents
  return await Promise.all([
    User.createPublic(userId, {
      username:   user.username,
      photo_url:  user.photo_url
    }),
    User.createDelivery(userId, {
      name:       user.name,
      username:   user.username,
      photo_url:  user.photo_url,
      phone_num:  user.phone_num
    })
  ]);
};