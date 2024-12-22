const express = require('express');

const userRouter = express.Router();

// require
const verifyToken = require('../middlewares/verifyToken');
const userController = require('./../controllers/userController');

userRouter.get('/me', verifyToken, userController.getUserHeaderInfo);

module.exports = userRouter;