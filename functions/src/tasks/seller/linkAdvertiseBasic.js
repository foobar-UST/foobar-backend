const Advertise = require('../../models/Advertise');
const { randomInt } = require('../../utils/RandomUtils');

module.exports = async function linkAdvertiseBasicTask(change, context) {
  const advertiseDetail = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;

  if (advertiseDetail === null) {
    return await Advertise.deleteBasic(sellerId);
  }

  return await Advertise.createBasic(sellerId, {
    id: sellerId,
    url: advertiseDetail.url,
    image_url: advertiseDetail.image_url,
    created_at: advertiseDetail.created_at,
    seller_type: advertiseDetail.seller_type,
    random: randomInt()
  });
};