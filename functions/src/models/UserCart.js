const { db, admin } = require('../../config');
const { USER_CARTS_COLLECTION } = require("../../constants");

class UserCart {

  static async get(userId) {
    const document = await db.doc(`${USER_CARTS_COLLECTION}/${userId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getWithSection(sectionId) {
    const snapshot = await db.collection(USER_CARTS_COLLECTION)
      .where('section_id', '==', sectionId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async getWithSeller(sellerId) {
    const snapshot = await db.collection(USER_CARTS_COLLECTION)
      .where('seller_id', '==', sellerId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async update(userId, data) {
    const docRef = db.doc(`${USER_CARTS_COLLECTION}/${userId}`);

    Object.assign(data, {
      updated_at:  admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async upsert(userId, data) {
    const docRef = db.doc(`${USER_CARTS_COLLECTION}/${userId}`);

    Object.assign(data, {
      updated_at:  admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(data, { merge: true });
  }

  static async deleteFor(userId) {
    const docRef = db.doc(`${USER_CARTS_COLLECTION}/${userId}`);
    await docRef.delete();
  }
}

module.exports = UserCart;