const SellerSection = require("../../models/SellerSection");

/**
 * Link 'sections' sub-collection with 'sections_basic' sub-collection.
 */
module.exports = async function linkSectionsBasicTask(change, context) {
  const sectionDetail = change.after.exists ? change.after.data() : null;
  const sellerId = context.params.sellerId;
  const sectionId = context.params.sectionId;

  // Delete 'sections_basic' document
  if (sectionDetail === null) {
    return await SellerSection.deleteBasic(sellerId, sectionId);
  }

  return await SellerSection.createBasic(sellerId, sectionId, {
    title:              sectionDetail.title,
    title_zh:           sectionDetail.title_zh,
    seller_id:          sectionDetail.seller_id,
    seller_name:        sectionDetail.seller_name,
    seller_name_zh:     sectionDetail.seller_name_zh,
    delivery_time:      sectionDetail.delivery_time,
    cutoff_time:        sectionDetail.cutoff_time,
    max_users:          sectionDetail.max_users,
    joined_users_count: sectionDetail.joined_users_count,
    image_url:          sectionDetail.image_url,
    state:              sectionDetail.state,
    available:          sectionDetail.available
  });
};
