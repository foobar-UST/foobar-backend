const { db } = require('../../config');
const { USERS_DELIVERY_COLLECTION, USERS_PUBLIC_COLLECTION } = require('../../constants');

module.exports = function copyUserDataTask(change, context) {
  const document = change.after.exists ? change.after.data() : null;

  // Delete user documents
  if (document === null) {
    const deleteFromDelivery = db.collection(USERS_DELIVERY_COLLECTION)
      .doc(change.before.id)
      .delete();

    const deleteFromPublic = db.collection(USERS_PUBLIC_COLLECTION)
      .doc(change.before.id)
      .delete();
    
    return Promise.all([deleteFromDelivery, deleteFromPublic])
      .then(() => {
        console.log(`[Success] User documents deleted.`);
        return true;
      })
      .catch(err => {
        console.log(`[Error] Failed to delete user documents: ${err}`);
      });
  }

  // Update user documents
  const { name, username, photo_url, phone_num } = document;

  const updateToDelivery = db.collection(USERS_DELIVERY_COLLECTION).doc(change.after.id)
    .set({
      name: name,
      username: username,
      photo_url: photo_url,
      phone_num: phone_num
    });

  const updateToPublic = db.collection(USERS_PUBLIC_COLLECTION).doc(change.after.id)
    .set({
      username: username,
      photo_url: photo_url
    });

  return Promise.all([updateToDelivery, updateToPublic])
    .then(() => {
      console.log(`[Success] User documents updated.`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to update user documents: ${err}`);
    });
};