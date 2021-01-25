const deleteCollection = require("../utils/deleteCollection");
const { db, admin } = require('../config');
const { USER_CART_ITEMS_SUB_COLLECTION } = require("../constants");
const { USERS_COLLECTION } = require("../constants");

class CartItem {

   static async get(userId, cartItemId) {
     const document = await db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     ).get();

     return document.exists ? document.data() : null;
   }

   static async getAll(userId) {
     const snapshot = await db.collection(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`
     ).get();

     return snapshot.docs.map(doc => doc.data());
   }

   static async getByItemId(itemId) {
     const snapshot = await db.collectionGroup(USER_CART_ITEMS_SUB_COLLECTION)
       .where('item_id', '==', itemId)
       .get();

     if (snapshot.empty) {
       return null;
     }

     const cartItems = [];

     snapshot.forEach(doc => {
       cartItems.push(doc.data());
     });

     return cartItems;
   }

  static async findDocByItemId(userId, itemId) {
    const snapshot = await db.collection(
      `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`
    )
      .where('item_id', '==', itemId)
      .get();

    // Not cart item matches with the required item id
    if (snapshot.empty) return null;

    const document = snapshot.docs[0];
    return document.exists ? document : null;
  }

   static async create(userId, cartItem) {
     const docRef = db.collection(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`
     ).doc();

     Object.assign(cartItem, {
       id:          docRef.id,
       updated_at:  admin.firestore.FieldValue.serverTimestamp()
     });

     await docRef.set(cartItem);

     return cartItem;
   }

   static async update(userId, cartItemId, data) {
     const docRef = db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     );

     Object.assign(data, {
       updated_at:  admin.firestore.FieldValue.serverTimestamp()
     });

     await docRef.update(data);
   }

   static async delete(userId, cartItemId) {
     const docRef = db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     );
     await docRef.delete();
   }

   static async deleteAllForUser(userId) {
     await deleteCollection(`${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`);
   }

   static async deleteAllForUsers(userIds) {
     const deleteJobs = userIds.map(userId => {
       return CartItem.deleteAllForUser(userId);
     });

     await Promise.all(deleteJobs);
   }
}

module.exports = CartItem;