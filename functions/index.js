const { functions } = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.text());

app.use('/user', require('./src/api/routes/userRoutes'));
app.use('/cart', require('./src/api/routes/cartRoutes'));
app.use('/order', require('./src/api/routes/orderRoutes'));
app.use('/device', require('./src/api/routes/deviceRoutes'));
app.use('/seller', require('./src/api/routes/sellerRoutes'));
app.use('/section', require('./src/api/routes/sectionRoutes'));

exports.api = functions.runWith({ timeoutSeconds: 10 }).https
  .onRequest(app);

// Tasks
exports.admin     = require('./src/tasks/adminTask');
exports.storage   = require('./src/tasks/storageTasks');
exports.user      = require('./src/tasks/userTasks');
exports.seller    = require('./src/tasks/sellerTasks');
exports.section   = require('./src/tasks/sectionTasks');
exports.cart      = require('./src/tasks/cartTasks');
exports.order     = require('./src/tasks/orderTasks');
exports.promotion = require('./src/tasks/promotionTasks');