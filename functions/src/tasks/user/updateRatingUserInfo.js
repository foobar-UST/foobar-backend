const Rating = require("../../models/Rating");

module.exports = async function updateRatingUserInfoTask(change, context) {
  const prevUserDetail = change.before.data();
  const newUserDetail = change.after.data();
  const userId = context.params.userId;

  const requireUpdate = prevUserDetail.username !== newUserDetail.username ||
    prevUserDetail.photo_url !== newUserDetail.photo_url;

  if (requireUpdate) {
    await Rating.updateUserInfo(userId, {
      username: newUserDetail.username,
      user_photo_url: newUserDetail.photo_url
    });
  }

  return true;
};