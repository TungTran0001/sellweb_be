const multer = require('multer');
const path = require('path');

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image_url') {
            cb(null, path.join(__dirname, '../../uploads/products')); // Ảnh chính
        } else if (file.fieldname === 'gallery') {
            cb(null, path.join(__dirname, '../../uploads/products/gallery')); // Gallery
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const productFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
}

const uploadProduct = multer({
    storage: productStorage,
    fileFilter: productFileFilter,
    limits: { fieldSize: 2 * 1024 * 1024 }, // Giới hạn 2MB mỗi file
});

module.exports = uploadProduct;