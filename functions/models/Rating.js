const { db, admin } = require('../config');
const { SELLERS_COLLECTION,
  SELLER_RATINGS_SUB_COLLECTION,
  SELLER_RATINGS_BASIC_SUB_COLLECTION
} = require('../constants');

class Rating {

  static async createDetail(sellerId, data) {
    const docRef = db.collection(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_RATINGS_SUB_COLLECTION}`
    ).doc();

    Object.assign(data, {
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(data);
  }

  static async createBasic(sellerId, ratingId, ratingBasic) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_RATINGS_BASIC_SUB_COLLECTION}/${ratingId}`
    );

    Object.assign(ratingBasic, { id: ratingId });

    await docRef.set(ratingBasic);
  }

  static async updateFor(userId, data) {
    const querySnapshot = await db.collectionGroup(SELLER_RATINGS_SUB_COLLECTION)
      .where('user_id', '==', userId)
      .get();

    const updatePromises = querySnapshot.docs.map(doc => {
      return doc.ref.update(data);
    });

    await Promise.all(updatePromises);
  }

  static async deleteBasic(sellerId, ratingId) {
    const docRef = db.doc(
      `${SELLERS_COLLECTION}/${sellerId}/${SELLER_RATINGS_BASIC_SUB_COLLECTION}/${ratingId}`
    );

    await docRef.delete();
  }

  static async deleteFor(userId) {
    const querySnapshot = await db.collectionGroup(SELLER_RATINGS_SUB_COLLECTION)
      .where('user_id', '==', userId)
      .get();

    const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());

    await Promise.all(deletePromises);
  }
}

module.exports = Rating;