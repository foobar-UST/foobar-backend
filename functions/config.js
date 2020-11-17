const admin = require('firebase-admin');
const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://foobar-group-delivery-app.firebaseio.com',
  storageBucket: 'foobar-group-delivery-app.appspot.com',
});

const db = admin.firestore();

db.settings({ 
  ignoreUndefinedProperties: true 
});

const webAuth = async (req, res, next) => {
  const idToken = req.headers.idToken;

  if (idToken) {
    console.log(`Authorized: ${idToken}`);

    try {
      const decodedToken = await (admin.auth().verifyIdToken(idToken));
      req.uid = decodedToken.uid;
      next();
      return;
    } catch(err) {
      res.status(401).send({
        message: `Not authorized: ${err}`,
      });
    }
  }
}

module.exports = { 
  admin, 
  db,
  webAuth,
};