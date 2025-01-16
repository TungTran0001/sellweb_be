const express = require('express');

const uploadProduct = require('../config/multerProductConfig');
const productController = require('../controllers/productController.js');
const verifyToken = require('../middlewares/verifyToken.js');

const productRoutes = express.Router();

// Route tạo sản phẩm
productRoutes.post(
    '/create', 
    uploadProduct.fields([
        { name: 'image_url', maxCount: 1 }, // Chỉ cho phép 1 ảnh chính
        { name: 'gallery', maxCount: 5 }, // Tối đa 5 ảnh cho gallery
    ]), 
    productController.createProduct
);

productRoutes.get('/', verifyToken, productController.getProductCardInfoProducts);

module.exports = productRoutes;