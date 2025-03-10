const path = require('path');
const multer = require('multer');

// Định nghĩa nơi lưu trữ file và đặt tên file
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {   
        cb(null, 'uploads/avatars'); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tên file duy nhất
    }
});

// Kiểm tra định dạng file
const avatarFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, JPG files are allowed!'), false);
    }
}

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // Giới hạn 2MB
    }
});

module.exports = uploadAvatar;