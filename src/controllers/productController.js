const path = require('path');
const productController = {};

const productModel = require('../models/productModel');
const { slugify } = require('../utils/slugify');

productController.createProduct = async (request, response) => {
    try {
        const {
            name,
            category_id,
            brand_id,
            description,
            price,
            discount_price,
            stock,
            is_active
        } = request.body;

        // Kiểm tra nếu không có ảnh chính
        if (!request.files || !request.files.image_url || request.files.image_url.length === 0) {
            return response.status(400).json({ message: 'Product main image is required' });
        }

        // Đường dẫn ảnh chính
        const imageUrl = path.join('/uploads/products', request.files.image_url[0].filename);


         // Đường dẫn gallery
        const galleryUrls = request.files.gallery ? request.files.gallery.map((file) => 
            path.join('/uploads/products/gallery', file.filename)
        ) : null;

        // Tạo id_query
        const idQuery = `${slugify(name)}-pro.${Math.round(Math.random() * 1E9)}`;

        // Tạo sản phẩm
        const newProduct = {
            name,
            id_query: idQuery,
            category_id,
            brand_id,
            description,
            price,
            discount_price,
            stock,
            number_sold: 0,
            image_url: imageUrl,
            gallery: galleryUrls ? JSON.stringify(galleryUrls) : null,
            is_active
        }
        const result = await productModel.createProduct(newProduct);
        response.status(201).json({
            message: 'Product created successfully',
            product: { id: result.insertId, ...newProduct },
        });
    } catch (error) {
        console.error('Error creating product:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = productController;