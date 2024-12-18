const express = require('express');

const profileRouter = express.Router();

// Require
const profileController = require('../controllers/profileController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/multerConfig');

profileRouter.get('/', verifyToken, profileController.getProfile);
profileRouter.put('/update', verifyToken, upload.single('avatar'), profileController.updateProfile);

module.exports = profileRouter;