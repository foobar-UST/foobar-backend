const Rating = require("../../models/Rating");

module.exports = async function linkRatingsBasicTask(change, context) {
  const ratingDetail = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;
  const ratingId = context.params.ratingId;

  if (ratingDetail === null) {
    return await Rating.deleteBasic(sellerId, ratingId);
  }

  await Rating.createBasic(sellerId, ratingId, {
    username: ratingDetail.username,
    user_photo_url: ratingDetail.user_photo_url,
    order_rating: ratingDetail.order_rating,
    delivery_rating: ratingDetail.delivery_rating,
    created_at: ratingDetail.created_at
  });

  return true;
};