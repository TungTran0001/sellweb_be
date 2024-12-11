const express = require('express');

const profileRouter = express.Router();

// Require
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');

profileRouter.get('/', verifyToken, profileController.getProfile);

module.exports = profileRouter;