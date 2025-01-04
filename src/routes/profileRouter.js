const express = require('express');

const profileRouter = express.Router();

// Require
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');
const uploadAvatar = require('../config/multerAvatarConfig');


profileRouter.get('/', verifyToken, profileController.getProfile);
profileRouter.put('/update', verifyToken, uploadAvatar.single('avatar'), profileController.updateProfile);

module.exports = profileRouter;