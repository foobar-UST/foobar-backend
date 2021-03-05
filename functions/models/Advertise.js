const { db, admin } = require('../config');
const { ADVERTISES_BASIC_COLLECTION,
  SELLER_ADVERTISES_SUB_COLLECTION,
  SELLERS_COLLECTION } = require('../constants');
const { randomInt } = require('../utils/RandomUtils');

class Advertise {

  static async createDetail(sellerId, data) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_ADVERTISES_SUB_COLLECTION}/0`
    );

    Object.assign(data, {
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(data);
  }

  static async createBasic(sellerId, data) {
    const docRef = db.doc(`${ADVERTISES_BASIC_COLLECTION}/${sellerId}`);
    await docRef.set(data);
  }

  static async deleteBasic(sellerId) {
    const docRef = db.doc(`${ADVERTISES_BASIC_COLLECTION}/${sellerId}`);
    await docRef.delete();
  }

  static async updateDetail(sellerId, data) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_ADVERTISES_SUB_COLLECTION}/0`
    );

    await docRef.update(data);
  }

  static async updateBasicsRandom() {
    const querySnapshot = await db.collection(ADVERTISES_BASIC_COLLECTION).get();
    const updatePromises = [];

    querySnapshot.forEach(doc => {
      updatePromises.push(
        doc.ref.update({ random: randomInt() })
      );
    });

    await Promise.all(updatePromises);
  }
}

module.exports = Advertise;