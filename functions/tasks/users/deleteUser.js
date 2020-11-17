const { db } = require('../../config');
const { USER_PHOTOS_FOLDER } = require('../../constants');

module.exports = function deleteUserTask(user) {
  const { uid } = user;

  // Remove user photo
  const bucket = admin.storage().bucket();
  const path = `${USER_PHOTOS_FOLDER}/${uid}`;
  
  // Remove user document
  const deletePhoto = bucket.file(path).delete();
  const deleteUser = db.collection(USERS_COLLECTION).doc(uid).delete();

  return Promise.all([deletePhoto, deleteUser])
    .then(() => {
      console.log(`[Success] User resources are removed.`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to remove user resources: ${err}`);
    });
};
