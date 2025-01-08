const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file cho category
const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads', 'categories'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Bộ lọc file chỉ chấp nhận ảnh
const categoryFileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed for banners.'));
    }
}

// Cấu hình Multer cho category
const uploadCategory = multer({
    storage: categoryStorage,
    fileFilter: categoryFileFilter,
    limits: { fieldSize: 2 * 1024 * 1024 } // Gới hạn 2MBs
})

module.exports = uploadCategory;