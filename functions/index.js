const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());

// Routes
// https://us-central1-foobar-group-delivery-app.cloudfunctions.net/routes
app.use('/test', require('./routes/test'));
app.use('/sellers', require('./routes/sellers'));

exports.routes = functions.https.onRequest(app);

// Tasks
exports.common = require('./tasks/common');
exports.users = require('./tasks/users');
exports.sellers = require('./tasks/sellers');
