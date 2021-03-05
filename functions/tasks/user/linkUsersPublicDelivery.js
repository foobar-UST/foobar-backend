const User = require("../../models/User");

/**
 * Link 'user' collection with 'users_public' and 'users_delivery' collections.
 * 1. Link deletion
 * 2. Link update
 */
module.exports = async function linkUsersPublicDeliveryTask(change, context) {
  const userDetail = change.after.exists ? change.after.data() : null;
  const userId = context.params.userId;

  // Delete user documents
  if (userDetail === null) {
    return await Promise.all([
      User.deletePublic(userId),
      User.deleteDelivery(userId)
    ]);
  }

  // Update user documents
  return await Promise.all([
    User.createPublic(userId, {
      username:   userDetail.username,
      photo_url:  userDetail.photo_url
    }),
    User.createDelivery(userId, {
      name:       userDetail.name,
      username:   userDetail.username,
      photo_url:  userDetail.photo_url,
      phone_num:  userDetail.phone_num
    })
  ]);
};