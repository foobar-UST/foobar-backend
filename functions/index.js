const { functions } = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());

// Url: https://us-central1-foobar-group-delivery-app.cloudfunctions.net/api
app.use('/user', require('./api/routes/userRoutes'));
app.use('/cart', require('./api/routes/cartRoutes'));
app.use('/order', require('./api/routes/orderRoutes'));
app.use('/device', require('./api/routes/deviceRoutes'));

exports.api = functions.runWith({ timeoutSeconds: 10 })
  .https
  .onRequest(app);

// Tasks
exports.storage   = require('./tasks/storageTasks');
exports.user      = require('./tasks/userTasks');
exports.seller    = require('./tasks/sellerTasks');
exports.section   = require('./tasks/sectionTasks');
exports.cart      = require('./tasks/cartTasks');
exports.order     = require('./tasks/orderTasks');
