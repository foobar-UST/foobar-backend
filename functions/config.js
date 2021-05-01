const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const firebase_functions = require('firebase-functions');

// Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://foobar-group-delivery-app.firebaseio.com',
  storageBucket: 'foobar-group-delivery-app.appspot.com'
});

// Firestore
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Functions
const functions = firebase_functions.region('asia-east2');

module.exports = { 
  admin, 
  db,
  functions
};