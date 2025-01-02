const express = require('express');
const addressRouter = express.Router();

const addressController = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');



addressRouter.post('/', verifyToken, addressController.createAddress);
addressRouter.get('/', verifyToken, addressController.getUserAddresses);
addressRouter.put('/:id', verifyToken, addressController.updateAddress);

module.exports = addressRouter;