const { db } = require('../../config');
const { USERS_COLLECTION } = require('../../constants');

module.exports = function updateUserRolesTask(snap, context) {
  const uid = context.params.userId;
  const roles = 'user';

  return db.collection(USERS_COLLECTION)
    .doc(uid)
    .update({
      roles: admin.firestore.FieldValue.arrayUnion(roles)
    })
    .then(() => {
      console.log(`[Success] Updated user roles: ${uid}.`);
      return true;
    })
    .catch(err => {
      console.log(`[Error] Failed to user roles: ${err}`);
    });
};

