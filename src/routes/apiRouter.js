const express = require('express');
const apiRouter = express.Router();

const cookieParser = require('cookie-parser');

// Require routes
const authRouter = require('./authRouter');

apiRouter.use(cookieParser());

apiRouter.use("/auth", authRouter);

module.exports = apiRouter;