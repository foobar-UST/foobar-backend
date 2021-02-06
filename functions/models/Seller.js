const { SELLER_ITEMS_SUB_COLLECTION } = require("../constants");
const { db, admin } = require('../config');
const { SELLERS_BASIC_COLLECTION } = require("../constants");
const { SELLERS_COLLECTION } = require("../constants");

class Seller {

  static async getDetail(sellerId) {
    const document = await db.doc(`${SELLERS_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getBasic(sellerId) {
    const document = await db.doc(`${SELLERS_BASIC_COLLECTION}/${sellerId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getDetailHavingItem(itemId) {
    const snapshot = await db.collectionGroup(SELLER_ITEMS_SUB_COLLECTION)
      .where('id', '==', itemId)
      .get();

    const itemDetailDoc = snapshot.empty ? null : snapshot.docs[0];
    // Get back top level seller document
    const document = await itemDetailDoc.ref.parent.parent.get();

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
}

module.exports = Seller;