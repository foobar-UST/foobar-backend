// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());
app.use('/test', require('./routes/test'));
app.use('/restaurant', require('./routes/restaurant'));


exports.app = functions.https.onRequest(app);
