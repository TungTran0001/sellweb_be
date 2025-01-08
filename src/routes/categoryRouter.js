const express = require('express');

const verifyToken = require('../middlewares/verifyToken');
const categoryController = require('../controllers/categoryController');
const uploadCategory = require('../config/multerCategoryConfig');

const categoryRouter = express.Router();

categoryRouter.post('/', verifyToken, uploadCategory.single("category"), categoryController.createCategory);

module.exports = categoryRouter;