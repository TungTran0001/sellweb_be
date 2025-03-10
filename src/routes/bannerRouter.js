const express = require('express');

const bannerController = require('../controllers/bannerController');
const verifyToken = require('../middlewares/verifyToken');
const uploadBanner = require('../config/multerBannerConfig');

const bannerRouter = express.Router();

bannerRouter.post("/", verifyToken, uploadBanner.single('banner'), bannerController.createBanner);
bannerRouter.get("/homepage", verifyToken, bannerController.getHomePageBanners);

module.exports = bannerRouter;