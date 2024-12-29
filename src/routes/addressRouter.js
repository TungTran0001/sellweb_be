const express = require('express');
const addressRouter = express.Router();

const addressController = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');



addressRouter.post('/', verifyToken, addressController.createAddress);

module.exports = addressRouter;