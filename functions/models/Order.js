const { ORDERS_BASIC_COLLECTION } = require("../constants");
const { ORDERS_COLLECTION } = require("../constants");
const { db, admin } = require('../config');

class Order {

  static async createDetail(orderDetail) {
    const docRef = db.collection(ORDERS_COLLECTION).doc();

    Object.assign(orderDetail, {
      id:             docRef.id,
      created_at:     admin.firestore.FieldValue.serverTimestamp(),
      updated_at:     admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.set(orderDetail);
  }

  static async createBasic(orderId, orderBasic) {
    const docRef = db.doc(`${ORDERS_BASIC_COLLECTION}/${orderId}`);
    await docRef.set(orderBasic);
  }

  static async updateDetail(orderId, data) {
    const docRef = db.doc(`${ORDERS_COLLECTION}/${orderId}`);

    Object.assign(data, {
      updated_at:      admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async deleteDetail(orderId) {
    const docRef = db.doc(`${ORDERS_COLLECTION}/${orderId}`);
    await docRef.delete();
  }
}

module.exports = Order;