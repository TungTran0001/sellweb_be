const pool = require("../../db");

const categoryModel = {};

categoryModel.createCategory = (categoryData) => {
    return new Promise((resolve, reject) => { 
        const sql = `
            INSERT INTO categories (name, id_query, parent_id, description, image_url, display_order, is_active)
            VALUE (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            categoryData.name,
            categoryData.id_query,
            categoryData.parent_id,
            categoryData.description,
            categoryData.image_url,
            categoryData.display_order,
            categoryData.is_active,
        ]
        pool.query(
            sql,
            params,
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

module.exports = categoryModel;