const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file cho banner
const bannerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads', 'banners'));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Bộ lọc file chỉ chấp nhận ảnh
const bannerFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed for banners.'));
    }
};

// Cấu hình Multer cho banner
const uploadBanner = multer({
    storage: bannerStorage,
    fileFilter: bannerFileFilter,
    limits: { fieldSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

module.exports = uploadBanner;