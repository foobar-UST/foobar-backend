const SellerSection = require("../../models/SellerSection");

/**
 * Link 'sections' sub-collection with 'sections_basic' sub-collection.
 */
module.exports = async function linkSectionsBasicTask(change, context) {
  const section     = change.after.exists ? change.after.data() : null;
  const sellerId    = context.params.sellerId;
  const sectionId   = context.params.sectionId;

  // Delete 'sections_basic' document
  if (section === null) {
    return await SellerSection.deleteBasic(sellerId, sectionId);
  }

  return await SellerSection.createBasic(sellerId, sectionId, {
    id:                 section.id,
    title:              section.title,
    title_zh:           section.title_zh,
    seller_id:          section.seller_id,
    seller_name:        section.seller_name,
    seller_name_zh:     section.seller_name_zh,
    delivery_time:      section.delivery_time,
    cutoff_time:        section.cutoff_time,
    max_users:          section.max_users,
    joined_users_count: section.joined_users_count,
    image_url:          section.image_url,
    state:              section.state,
    available:          section.available
  });
}
