const { db, admin } = require('../config');
const { ORDER_LOCATIONS_COLLECTION } = require("../constants");

class OrderLocation {

  static async upsert(orderId, data) {
    const docRef = db.doc(`${ORDER_LOCATIONS_COLLECTION}/${orderId}`);

    Object.assign(data, {
      id: orderId,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(data, { merge: true });
  }

  static async delete(orderId) {
    const docRef = db.doc(`${ORDER_LOCATIONS_COLLECTION}/${orderId}`);
    await docRef.delete();
  }
}

module.exports = OrderLocation;