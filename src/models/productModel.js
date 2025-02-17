const pool = require("../../db");

const productModel = {};

productModel.createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO products (name, id_query, category_id, brand_id, description, price, discount_price, stock, image_url, gallery, rating, reviews_count, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        pool.query(
            sql,
            [product.name, product.id_query, product.category_id, product.brand_id, product.description, product.price, product.discount_price, product.stock, product.image_url, product.gallery, product.rating || 0.0, product.reviews_count || 0, product.is_active || true],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

productModel.getProductCardInfoProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT name, id_query, price, number_sold, image_url FROM products WHERE is_active = true`;
        pool.query(
            sql,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

productModel.getProductDetails = (id_query) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, name, price, discount_price, stock, number_sold, image_url, gallery, rating, reviews_count
            FROM products WHERE id_query = ? AND is_active = 1 
        `;
        pool.query(
            sql,
            [id_query],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

productModel.getColorsByProducId = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, color_name, color_code, image_url
            FROM product_colors
            WHERE product_id = ?
        `;
        pool.query(
            sql,
            [productId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

productModel.getSizeByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, size_name
            FROM product_sizes
            WHERE product_id = ?
        `;
        pool.query(
            sql,
            [productId],
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

module.exports = productModel;