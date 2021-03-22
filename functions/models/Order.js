const { db, admin } = require('../config');
const { ORDERS_BASIC_COLLECTION, ORDERS_COLLECTION } = require('../constants');

class Order {

  static async getDetail(orderId) {
    const document = await db.doc(`${ORDERS_COLLECTION}/${orderId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getBasic(orderId) {
    const document = await db.doc(`${ORDERS_BASIC_COLLECTION}/${orderId}`).get();
    return document.exists ? document.data() : null;
  }

  static async getOrderIdsBy(field, value) {
    const snapshot = await db.collection(ORDERS_COLLECTION)
      .where(field, '==', value)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const orderIds = [];
    snapshot.forEach(doc => {
      orderIds.push(doc.data().id);
    });

    return orderIds;
  }

  static createDoc() {
    return db.collection(ORDERS_COLLECTION).doc();
  }

  static async createDetail(orderDoc, orderDetail) {
    Object.assign(orderDetail, {
      id:             orderDoc.id,
      created_at:     admin.firestore.FieldValue.serverTimestamp(),
      updated_at:     admin.firestore.FieldValue.serverTimestamp()
    });

    await orderDoc.set(orderDetail);
  }

  static async createBasic(orderId, orderBasic) {
    const docRef = db.doc(`${ORDERS_BASIC_COLLECTION}/${orderId}`);

    Object.assign(orderBasic, { id: orderId });

    await docRef.set(orderBasic);
  }

  static async updateDetail(orderId, data) {
    const docRef = db.doc(`${ORDERS_COLLECTION}/${orderId}`);

    Object.assign(data, {
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    await docRef.update(data);
  }

  static async deleteDetail(orderId) {
    const docRef = db.doc(`${ORDERS_COLLECTION}/${orderId}`);
    await docRef.delete();
  }

  static async deleteBasic(orderId) {
    const docRef = db.doc(`${ORDERS_BASIC_COLLECTION}/${orderId}`);
    await docRef.delete();
  }
}

module.exports = Order;