const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const firebase_functions = require('firebase-functions');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://foobar-group-delivery-app.firebaseio.com',
  storageBucket: 'foobar-group-delivery-app.appspot.com'
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const functions = firebase_functions
  .region('asia-east2');

module.exports = { 
  admin, 
  db,
  functions
};