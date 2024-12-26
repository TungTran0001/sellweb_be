const express = require('express');
const apiRouter = express.Router();

// Require routes
const authRouter = require('./authRouter');
const notificationRouter = require('./notificationRouter');
const profileRouter = require('./profileRouter');
const userRouter = require('./userRouter');
const locationRouter = require('./locationRouter');

apiRouter.use("/auth", authRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/profiles", profileRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/locations", locationRouter);

module.exports = apiRouter;