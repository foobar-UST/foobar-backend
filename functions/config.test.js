const firebase = require('@firebase/rules-unit-testing');
const admin = require('firebase-admin');

// Load test environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });

// Admin
const projectId = process.env.GCLOUD_PROJECT;
const app = admin.initializeApp({ projectId });

// Firestore
const db = firebase.firestore(app);

const clearDb = async () => {
  await firebase.clearFirestoreData({ projectId });
};

module.exports = {
  admin,
  db,
  clearDb
};