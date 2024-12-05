const express = require('express');
const notificationRouter = express.Router();

// Require notificationController
const notificationController = require('../controllers/notificationController');
const verifyToken = require('../middlewares/verifyToken');

notificationRouter.get('/', verifyToken, notificationController.getNotifications);

module.exports = notificationRouter;