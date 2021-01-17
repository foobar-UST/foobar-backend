const { db, admin } = require('../config');
const { USERS_DELIVERY_COLLECTION } = require("../constants");
const { USERS_PUBLIC_COLLECTION } = require("../constants");
const { USERS_COLLECTION } = require("../constants");
const { USER_PHOTOS_FOLDER } = require("../constants");

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
      updated_at:  admin.firestore.FieldValue.serverTimestamp()
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
    await docRef.set(userPublic);
  }

  static async deletePublic(userId) {
    const docRef = db.doc(`${USERS_PUBLIC_COLLECTION}/${userId}`);
    await docRef.delete();
  }

  static async createDelivery(userId, userDelivery) {
    const docRef = db.doc(`${USERS_DELIVERY_COLLECTION}/${userId}`);
    await docRef.set(userDelivery);
  }

  static async deleteDelivery(userId) {
    const docRef = db.doc(`${USERS_DELIVERY_COLLECTION}/${userId}`);
    await docRef.delete();
  }

  static async deletePhoto(userId) {
    const bucket = admin.storage().bucket();
    const originalFile = bucket.file(`${USER_PHOTOS_FOLDER}/${userId}`);
    const compressedFile = bucket.file(`${USER_PHOTOS_FOLDER}/${userId}@s_720`);

    const originalExist = (await originalFile.exists())[0];
    const compressedExist = (await compressedFile.exists())[0];
    const deleteJobs = [];

    if (originalExist) deleteJobs.push(originalFile.delete());
    if (compressedExist) deleteJobs.push(compressedFile.delete());

    await Promise.all(deleteJobs);
  }
}

module.exports = User;