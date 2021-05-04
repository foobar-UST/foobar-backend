const OrderState = require('./OrderState');
const { db, admin } = require('../../config');
const { ORDERS_BASIC_COLLECTION, ORDERS_COLLECTION } = require('../../constants');

class Order {

  static async getDetailsBySection(sectionId) {
    const snapshot = await db.collection(ORDERS_COLLECTION)
      .where('section_id', '==', sectionId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async getDetailsBySeller(sellerId) {
    const snapshot = await db.collection(ORDERS_COLLECTION)
      .where('seller_id', '==', sellerId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async getDetailsByUser(userId) {
    const snapshot = await db.collection(ORDERS_COLLECTION)
      .where('user_id', '==', userId)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async getDetailsActive(sectionId) {
    const snapshot = await db.collection(ORDERS_COLLECTION)
      .where('section_id', '==', sectionId)
      .where('state', 'not-in', [
        OrderState.DELIVERED,
        OrderState.ARCHIVED,
        OrderState.CANCELLED
      ])
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static getOrderDetailCollectionRef() {
    return db.collection(ORDERS_COLLECTION)
  }

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