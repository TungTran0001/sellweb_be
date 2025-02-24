const express = require('express');

const cartController = require('../controllers/cartController');
const verifyToken = require('../middlewares/verifyToken');

const cartRouter = express.Router();

// route create cart
cartRouter.post('/', verifyToken, cartController.addToCart);
cartRouter.get('/latest', verifyToken, cartController.getLatestCartItems);

module.exports = cartRouter;