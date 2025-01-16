const express = require('express');
const apiRouter = express.Router();

// Require routes
const authRouter = require('./authRouter');
const notificationRouter = require('./notificationRouter');
const profileRouter = require('./profileRouter');
const userRouter = require('./userRouter');
const locationRouter = require('./locationRouter');
const addressRouter = require('./addressRouter');
const bannerRouter = require('./bannerRouter');
const categoryRouter = require('./categoryRouter');
const productRoutes = require('./productRoutes');

apiRouter.use("/auth", authRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/profiles", profileRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/locations", locationRouter);
apiRouter.use("/addresses", addressRouter);
apiRouter.use("/banners", bannerRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/products", productRoutes);

module.exports = apiRouter;