const { db, admin } = require('../config');
const { SELLER_ITEMS_BASIC_SUB_COLLECTION } = require("../constants");
const { SELLERS_COLLECTION } = require("../constants");
const { SELLER_ITEMS_SUB_COLLECTION } = require("../constants");

class SellerItem {

  static async getDetail(sellerId, itemId) {
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
}

module.exports = SellerItem;