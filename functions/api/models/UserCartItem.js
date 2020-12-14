const { db } = require('../../config');
const { USER_CART_ITEMS_SUB_COLLECTION } = require("../../constants");
const { USERS_COLLECTION } = require("../../constants");

class UserCartItem {

   static async get(userId, cartItemId) {
     const document = await db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     ).get();

     return document.exists ? document.data() : null;
   }

   static async create(userId, cartItem) {
     const docRef = db.collection(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}`
     ).doc();
     const data = { id: docRef.id };

     await docRef.set(Object.assign(data, cartItem));
     return data;
   }

   static async update(userId, cartItemId, data) {
     const docRef = db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     );

     return await docRef.update(data);
   }

   static async delete(userId, cartItemId) {
     const docRef = db.doc(
       `${USERS_COLLECTION}/${userId}/${USER_CART_ITEMS_SUB_COLLECTION}/${cartItemId}`
     );

     return await docRef.delete();
   }
}

module.exports = UserCartItem;