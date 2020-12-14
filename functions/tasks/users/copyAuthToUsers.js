const { db, admin } = require('../../config');
const { USERS_COLLECTION } = require('../../constants');

/**
 * Copy data from Auth to 'users' collection when a new user is created.
 */
module.exports = async function copyAuthToUsersTask(user) {
  const document = {
    email:        user.email,
    username:     user.email.substring(0, user.email.indexOf('@')),
    roles:        ['user'],
    updated_at:   admin.firestore.FieldValue.serverTimestamp(),
  };

  return await db.collection(USERS_COLLECTION)
    .doc(user.uid)
    .set(document);
};