const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foobar-group-delivery-app.firebaseio.com"
});
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const storage = admin.storage();

async function webAuth (req, res, next) {
  const idToken = req.get('idToken');
  if (idToken) {
    console.log(idToken);
    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
      req.uid = decodedToken.uid;
      next();
      return;
    }).catch(function(error) {
      res.status(401).send({
        message: 'not authorized',
      });
    });
  }
}

module.exports = {
  functions,
  admin,
  db,
  storage,
  webAuth: webAuth,
};