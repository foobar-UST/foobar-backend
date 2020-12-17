const admin = require('firebase-admin');
const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://foobar-group-delivery-app.firebaseio.com',
  storageBucket: 'foobar-group-delivery-app.appspot.com'
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = { 
  admin, 
  db,
};