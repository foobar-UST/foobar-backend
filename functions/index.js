const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());

// Url: https://us-central1-foobar-group-delivery-app.cloudfunctions.net/api
app.use('/test', require('./api/routes/testRoutes'));
app.use('/user', require('./api/routes/userRoutes'));
app.use('/cart', require('./api/routes/cartRoutes'));
app.use('/order', require('./api/routes/orderRoutes'));

exports.api = functions.runWith({ timeoutSeconds: 10 }).https.onRequest(app);

// Tasks
exports.storage   = require('./tasks/storageTasks');
exports.broadcast = require('./tasks/broadcastTasks');
exports.users     = require('./tasks/userTasks');
exports.sellers   = require('./tasks/sellerTasks');
exports.cart      = require('./tasks/cartTasks');
