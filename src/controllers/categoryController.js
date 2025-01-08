const path = require('path');
const categoryModel = require('../models/categoryModel');
const { slugify } = require('../utils/slugify');
const categoryController = {};

categoryController.createCategory = async (request, response) => {
    try {
        const { name, parent_id, description, display_order, is_active } = request.body;
        if (!request.file || !name) {
            return response.status(400).json({
                message: "Category image and id query is required"
            });
        }
        // Tạo đường dẫn hình ảnh
        const imageUrl = path.join('/uploads/categories', request.file.filename);
        // Tạo id_query
        const idQuery = `${slugify(name)}-cat.${Math.round(Math.random() * 1E9)}`;
         // Tạo đối tượng category mới
         const newCategory = {
            name,
            id_query: idQuery,
            parent_id: parent_id || null,
            description,
            image_url: imageUrl,
            display_order: display_order,
            is_active: is_active || true,
         }
         // Lưu thông tin category vào database
         const result = await categoryModel.createCategory(newCategory);
         response.status(201).json({
            message: "Category created successfully",
            category: {id: result.insertId, ...newCategory },
         })
    } catch (error) {
        console.error("Failed creating categoory:", error);
        response.status(500).json({ message: "An error occurred while creating the category" });
    }
}

module.exports = categoryController;