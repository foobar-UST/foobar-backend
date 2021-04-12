const Rating = require("../../models/Rating");

module.exports = async function updateUserSyncRatingTask(change, context) {
  const prevUserDetail = change.before.data();
  const newUserDetail = change.after.data();
  const userId = context.params.userId;

  const syncRequired = prevUserDetail.photo_url !== newUserDetail.photo_url;

  if (!syncRequired) {
    return true;
  }

  await Rating.updateFor(userId, {
    user_photo_url: newUserDetail.photo_url
  });

  return true;
};