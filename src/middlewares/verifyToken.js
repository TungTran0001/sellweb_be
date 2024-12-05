const jsonwebtoken = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Access token is missing or invalid'});
    }
    const token = authHeader.split(' ')[1]; // Tách token từ `Bearer <token>`
    try {
        const decoded = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET); // Giải mã token
        req.userId = decoded.id; // Thêm thông tin user vào request
        next(); // Tiếp tục xử lý
    } catch (error) {
        return res.status(403).json({ message: 'Access token is expired or invalid' });
    }
}

module.exports = verifyToken;