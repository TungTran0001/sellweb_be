const express = require('express');
const addressRouter = express.Router();

const addressController = require('../controllers/addressController');
const verifyToken = require('../middlewares/verifyToken');



addressRouter.post('/', verifyToken, addressController.createAddress);
addressRouter.get('/', verifyToken, addressController.getUserAddresses);
addressRouter.put('/:id', verifyToken, addressController.updateAddress);
addressRouter.delete('/:addressId', verifyToken, addressController.deleteAddress);
addressRouter.put('/:addressId/default', verifyToken, addressController.setDefaultAddress);

module.exports = addressRouter;