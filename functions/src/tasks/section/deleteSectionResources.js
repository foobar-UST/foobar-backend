const SellerSection = require('../../models/SellerSection');

module.exports = async function deleteSectionResourcesTask(snap, context) {
  const sectionId = context.params.sectionId;
  return await SellerSection.deleteImage(sectionId);
};
