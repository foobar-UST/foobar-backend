const { db, admin } = require('../config');
const searchCollection = require("../utils/searchCollection");
const { SELLER_ITEMS_SUB_COLLECTION,
  SELLERS_BASIC_COLLECTION,
  SELLERS_COLLECTION } = require("../constants");

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
        by_user_id:   admin.firestore.FieldValue.delete()
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
    Object.assign(sellerBasic, { id: sellerId });
    await docRef.set(sellerBasic);
  }

  static async searchBasic(field, query) {
    return await searchCollection(query, SELLERS_BASIC_COLLECTION, field, 5);
  }
}

module.exports = Seller;