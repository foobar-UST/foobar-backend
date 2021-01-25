const { ORDERS_BASIC_COLLECTION } = require("../constants");
const { ORDERS_COLLECTION } = require("../constants");
const { db, admin } = require('../config');

class Order {

  static async getDetail(orderId) {
    const document = await db.doc(`${ORDERS_COLLECTION}/${orderId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getBasic(orderId) {
    const document = await db.doc(`${ORDERS_BASIC_COLLECTION}/${orderId}`).get();
    return document.exists ? document.data() : null;
  }

  static createDoc() {
    return db.collection(ORDERS_COLLECTION).doc();
  }

  static async createDetail(orderDoc, orderDetail) {
    //const docRef = db.collection(ORDERS_COLLECTION).doc();

    Object.assign(orderDetail, {
      id:             orderDoc.id,
      created_at:     admin.firestore.FieldValue.serverTimestamp(),
      updated_at:     admin.firestore.FieldValue.serverTimestamp()
    });

    await orderDoc.set(orderDetail);
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