const { db, admin } = require('../../config');
const searchCollection = require('../utils/searchCollection');
const { RESIZED_IMAGE_INFIX } = require('../utils/generateResizedImageUrl');
const { SELLER_ITEM_IMAGE_HEIGHT } = require('../../constants');
const { SELLER_ITEM_IMAGE_WIDTH } = require('../../constants');
const { SELLER_IMAGES_FOLDER } = require('../../constants');
const { deleteStorageFile } = require('../utils/deleteStorageFile');
const { SELLERS_BASIC_COLLECTION, SELLERS_COLLECTION } = require("../../constants");

class Seller {

  static async getDetail(sellerId) {
    const document = await db.doc(`${SELLERS_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getDetailBy(field, value) {
    const querySnapshot = await db.collection(SELLERS_COLLECTION)
      .where(field, '==', value)
      .get();

    return querySnapshot.empty ? null : querySnapshot.docs[0].data();
  }

  static async getBasic(sellerId) {
    const document = await db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async detachFromUser(userId) {
    const snapshot = await db.collection(SELLERS_COLLECTION)
      .where('by_user_id', '==', userId)
      .get();

    const sellerRefs = snapshot.docs.map(doc => doc.ref);
    const detachJobs = sellerRefs.map(ref => {
      return Seller.updateDetail(ref.id, {
        by_user_id: admin.firestore.FieldValue.delete()
      });
    })

    await Promise.all(detachJobs);
  }

  static async updateDetail(sellerId, data) {
    const docRef = db.doc(`${SELLERS_COLLECTION}/${sellerId}`);
    await docRef.update(data);
  }

  static async deleteBasic(sellerId) {
    const docRef = db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`);
    await docRef.delete();
  }

  static async createBasic(sellerId, sellerBasic) {
    const docRef = db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`);
    await docRef.set(sellerBasic);
  }

  static async searchBasic(field, query) {
    return await searchCollection(query, SELLERS_BASIC_COLLECTION, field, 5);
  }

  static async deleteImage(sellerId) {
    const originalFilePath = `${SELLER_IMAGES_FOLDER}/${sellerId}`;
    const compressedFilePath = `${SELLER_IMAGES_FOLDER}/${sellerId}
      ${RESIZED_IMAGE_INFIX}${SELLER_ITEM_IMAGE_WIDTH}_${SELLER_ITEM_IMAGE_HEIGHT}`;

    await Promise.all([
      deleteStorageFile(originalFilePath),
      deleteStorageFile(compressedFilePath)
    ]);
  }
}

module.exports = Seller;