const path = require('path');
const productController = {};

const productModel = require('../models/productModel');
const { slugify } = require('../utils/slugify');
const addressModel = require('../models/addressModel');

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

productController.getProductCardInfoProducts = async (request, response) => {
    try {
        // Gọi model để lấy dữ liệu từ database
        const products = await productModel.getProductCardInfoProducts();
         // Trả về danh sách các trường đã yêu cầu
         response.status(200).json({
            message: "Product retrieved successfully",
            products,
         });
    } catch (error) {
        console.error("Failed getting product:", error);
        response.status(500).json({ message: "An error occurred while getting the product" });
    }
}

productController.getProductDetails = async (request, response) => {
    try {
        const { id_query } = request.params;
        // Truy vấn dữ liệu từ bảng products
        const [product] = await productModel.getProductDetails(id_query);
        if (!product) {
            return response.status(404).json({ message: "Product not found" });
        }
        const addresses = await addressModel.getAddressesByUserId(request.userId);
        const colors = await productModel.getColorsByProducId(product.id);
        const sizes = await productModel.getSizeByProductId(product.id);
        response.status(200).json({
            message: "Product details fetched successfully",
            productDetails: {
                product,
                addresses,
                colors,
                sizes,
            }
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        response.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = productController;