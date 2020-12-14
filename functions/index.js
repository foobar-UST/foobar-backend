const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());

// Routes
// https://us-central1-foobar-group-delivery-app.cloudfunctions.net/routes
app.use('/test', require('./api/routes/testRoutes'));
app.use('/cart', require('./api/routes/cartRoutes'));

exports.api = functions.runWith(
  { timeoutSeconds: 10 }
  ).https.onRequest(app);

// Tasks
exports.common = require('./tasks/commonTasks');
exports.users = require('./tasks/userTasks');
exports.sellers = require('./tasks/sellerTasks');
exports.cart = require('./tasks/cartTasks');
