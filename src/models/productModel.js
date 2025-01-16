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

module.exports = productModel;