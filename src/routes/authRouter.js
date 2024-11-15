const express = require('express');
const authRouter = express.Router();

// Require controllers
const authController = require('./../controllers/authController');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password/:token', authController.resetPassword);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/logout', authController.logout);

module.exports = authRouter;