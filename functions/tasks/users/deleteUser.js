const { db, admin } = require('../../config');
const {
  USERS_COLLECTION,
  USER_CARTS_COLLECTION,
  USER_PHOTOS_FOLDER,
  USER_CART_ITEMS_SUB_COLLECTION,
  SUGGESTS_BASIC_COLLECTION } = require('../../constants');
const deleteCollection = require('../utils/deleteCollection');

/**
 * Clean up the resources when a user is deleted from Auth.
 * 1. Remove user photo
 * 2. Remove 'users' document
 */
module.exports = async function deleteUserTask(user) {
  const userId = user.uid;

  // Remove user photo if exist
  const bucket = admin.storage().bucket();
  const file = bucket.file(`${USER_PHOTOS_FOLDER}/${userId}`);
  const exists = (await file.exists())[0];

  if (exists) {
    await file.delete();
  }

  // Remove 'cart_items' subcollection
  await deleteCollection(`${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`);

  // Remove 'suggest_basic' subcollection
  await deleteCollection(`${USERS_COLLECTION}/${userId}/${SUGGESTS_BASIC_COLLECTION}`);

  // Remove 'users' document
  await db.collection(USERS_COLLECTION)
    .doc(userId)
    .delete();

  // Remove 'users_cart' document
  await db.collection(USER_CARTS_COLLECTION)
    .doc(userId)
    .delete();

  return true;
};