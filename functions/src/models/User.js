const { db, admin } = require('../../config');
const { RESIZED_IMAGE_INFIX } = require('../utils/generateResizedImageUrl');
const { USER_PHOTO_IMAGE_SIZE } = require('../../constants');
const { USERS_DELIVERY_COLLECTION } = require("../../constants");
const { USERS_PUBLIC_COLLECTION } = require("../../constants");
const { USERS_COLLECTION } = require("../../constants");
const { USER_PHOTOS_FOLDER } = require("../../constants");
const { deleteStorageFile } = require('../utils/deleteStorageFile');

class User {

  static async updateAuth(userId, authProfile) {
    await admin.auth().updateUser(userId, authProfile);
  }

  static async getUserDetail(userId) {
    const document = await db.doc(`${USERS_COLLECTION}/${userId}`).get();
    return document.exists ? document.data() : null;
  }

  static async createUser(userId, user) {
    const docRef = db.doc(`${USERS_COLLECTION}/${userId}`);

    Object.assign(user, {
      id:           userId,
      updated_at:   admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(user);
  }

  static async updateUser(userId, data) {
    const docRef = db.doc(`${USERS_COLLECTION}/${userId}`);

    Object.assign(data, {
      updated_at:  admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async deleteUser(userId) {
    const docRef = db.doc(`${USERS_COLLECTION}/${userId}`);
    await docRef.delete();
  }

  static async createPublic(userId, userPublic) {
    const docRef = db.doc(`${USERS_PUBLIC_COLLECTION}/${userId}`);
    Object.assign(userPublic, { id: userId });
    await docRef.set(userPublic);
  }

  static async deletePublic(userId) {
    const docRef = db.doc(`${USERS_PUBLIC_COLLECTION}/${userId}`);
    await docRef.delete();
  }

  static async createDelivery(userId, userDelivery) {
    const docRef = db.doc(`${USERS_DELIVERY_COLLECTION}/${userId}`);
    Object.assign(userDelivery, { id: userId });
    await docRef.set(userDelivery);
  }

  static async deleteDelivery(userId) {
    const docRef = db.doc(`${USERS_DELIVERY_COLLECTION}/${userId}`);
    await docRef.delete();
  }

  static async deletePhoto(userId) {
    const originalFilePath =`${USER_PHOTOS_FOLDER}/${userId}`;
    const compressedFilePath = `${USER_PHOTOS_FOLDER}/${userId}
      ${RESIZED_IMAGE_INFIX}${USER_PHOTO_IMAGE_SIZE}_${USER_PHOTO_IMAGE_SIZE}`;

    await Promise.all([
        deleteStorageFile(originalFilePath),
        deleteStorageFile(compressedFilePath)
    ]);
  }
}

module.exports = User;