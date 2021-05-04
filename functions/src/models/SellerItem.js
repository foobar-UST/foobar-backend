const { db, admin } = require('../../config');
const { SELLER_ITEM_IMAGE_HEIGHT } = require('../../constants');
const { SELLER_ITEM_IMAGE_WIDTH } = require('../../constants');
const { RESIZED_IMAGE_INFIX } = require('../utils/generateResizedImageUrl');
const { ITEM_IMAGES_FOLDER } = require('../../constants');
const { SELLER_ITEMS_BASIC_SUB_COLLECTION } = require("../../constants");
const { SELLERS_COLLECTION } = require("../../constants");
const { SELLER_ITEMS_SUB_COLLECTION } = require("../../constants");
const { deleteStorageFile } = require('../utils/deleteStorageFile');

class SellerItem {

  static async getDetail(itemId) {
    const querySnapshot = await db.collectionGroup(SELLER_ITEMS_SUB_COLLECTION)
      .where('id', '==', itemId)
      .get();

    return querySnapshot.empty ? null : querySnapshot.docs[0].data();
  }

  static async getDetailWith(sellerId, itemId) {
    const document = await db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/${itemId}`
    ).get();

    return document.exists ? document.data() : null;
  }

  static async getIdsWithCatalog(sellerId, catalogId) {
    const snapshot = await db.collection(`${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_SUB_COLLECTION}`)
      .where('catalog_id', '==', catalogId)
      .get();

    return snapshot.docs.map(doc => doc.data().id);
  }

  static async updateDetail(sellerId, itemId, data) {
    const docRef = db.doc(`${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_SUB_COLLECTION}/${itemId}`);

    Object.assign(data, {
      updated_at:  admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async deleteBasic(sellerId, itemId) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_BASIC_SUB_COLLECTION}/${itemId}`
    );
    await docRef.delete();
  }

  static async createBasic(sellerId, itemId, itemBasic) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_ITEMS_BASIC_SUB_COLLECTION}/${itemId}`
    );

    await docRef.set(itemBasic);
  }

  static async deleteImage(itemId) {
    const originalFilePath = `${ITEM_IMAGES_FOLDER}/${itemId}`;
    const compressedFilePath = `${ITEM_IMAGES_FOLDER}/${itemId}
      ${RESIZED_IMAGE_INFIX}${SELLER_ITEM_IMAGE_WIDTH}_${SELLER_ITEM_IMAGE_HEIGHT}`;

    await Promise.all([
      deleteStorageFile(originalFilePath),
      deleteStorageFile(compressedFilePath)
    ]);
  }
}

module.exports = SellerItem;