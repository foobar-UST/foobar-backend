const { db, admin } = require('../config');
const { USER_CARTS_COLLECTION } = require("../constants");

class UserCart {

  static async get(userId) {
    const document = await db.doc(`${USER_CARTS_COLLECTION}/${userId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getUserIdsBy(field, value) {
    const snapshot = await db.collection(USER_CARTS_COLLECTION)
      .where(field, '==', value)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const userCarts = [];
    snapshot.forEach(doc => {
      userCarts.push(doc.data().user_id);
    });

    return userCarts;
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