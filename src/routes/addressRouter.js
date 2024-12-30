const express = require('express');
const addressRouter = express.Router();

const addressController = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');



addressRouter.post('/', verifyToken, addressController.createAddress);
addressRouter.get('/', verifyToken, addressController.getUserAddresses);

module.exports = addressRouter;