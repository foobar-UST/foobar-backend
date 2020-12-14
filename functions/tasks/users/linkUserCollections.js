const { db } = require('../../config');
const { USERS_DELIVERY_COLLECTION, USERS_PUBLIC_COLLECTION } = require('../../constants');

/**
 * Link 'users' collection with 'users_public' and 'users_delivery' collections.
 * 1. Link deletion
 * 2. Link update
 */
module.exports = async function linkUserCollectionsTask(change, context) {
  const document = change.after.exists ? change.after.data() : null;

  // Delete user documents
  if (document === null) {
    const deleteDeliveryJob = db.collection(USERS_DELIVERY_COLLECTION)
      .doc(change.before.id)
      .delete();

    const deletePublicJob = db.collection(USERS_PUBLIC_COLLECTION)
      .doc(change.before.id)
      .delete();
    
    return await Promise.all([deleteDeliveryJob, deletePublicJob]);
  }

  // Update user documents
  const updateDeliveryJob = db.collection(USERS_DELIVERY_COLLECTION)
    .doc(change.after.id)
    .set({
      name:       document.name,
      username:   document.username,
      photo_url:  document.photo_url,
      phone_num:  document.phone_num
    });

  const updatePublicJob = db.collection(USERS_PUBLIC_COLLECTION)
    .doc(change.after.id)
    .set({
      username:   document.username,
      photo_url:  document.photo_url
    });

  return await Promise.all([updateDeliveryJob, updatePublicJob]);
};