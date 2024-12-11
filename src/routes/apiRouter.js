const express = require('express');
const apiRouter = express.Router();

// Require routes
const authRouter = require('./authRouter');
const notificationRouter = require('./notificationRouter');
const profileRouter = require('./profileRouter');

apiRouter.use("/auth", authRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/profile", profileRouter);

module.exports = apiRouter;