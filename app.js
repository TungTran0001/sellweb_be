const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const apiRouter = require('./src/routes/apiRouter');

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Đọc dữ liệu JSON từ body

// Cấu hình CORS
app.use(cors({
    origin: "http://localhost:3000", // Chỉ cho phép từ frontend này
    credentials: true, // Cho phép gửi cookie
}));

app.use(cookieParser()); // Đọc cookie từ các yêu cầu

// Cho phép truy cập các file tĩnh trong thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send("Welcome to us");
});

app.use('/api/v1', apiRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});