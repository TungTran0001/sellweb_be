const express = require('express');
const apiRouter = express.Router();

// Require routes
const authRouter = require('./authRouter');
const notificationRouter = require('./notificationRouter');

apiRouter.use("/auth", authRouter);
apiRouter.use("/notifications", notificationRouter);

module.exports = apiRouter;