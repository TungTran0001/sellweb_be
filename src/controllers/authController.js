const jsonwebtoken = require('jsonwebtoken');
const { hashSync, genSaltSync, compareSync } = require('bcrypt');
const nodemailer = require('nodemailer');

const userModel = require('./../models/userModel');
const authController = {};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // True cho port 465, false cho các port khác
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

authController.register = async (req, res) => {
    try {
        const initialValues = {
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        }
        // Kiểm tra các giá trị đầu vào
        if (!initialValues.userName || !initialValues.email || !initialValues.password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        // Mã hóa mật khẩu
        const salt = genSaltSync(10);
        initialValues.password = hashSync(initialValues.password, salt);
        // Tạo người dùng mới trong cơ sơ dữ liệu
        const user = await userModel.create(initialValues);
        console.log("user:", user);
        // Tạo Access Token với thời gian sống ngắn
        const accessToken = jsonwebtoken.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'} );
        // Tạo Refresh Token với thời gian sống dài hơn
        const refreshToken = jsonwebtoken.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
        // Lưu Refresh Token vào cơ sở dữ liệu
        await userModel.saveRefreshToken(user.insertId, refreshToken);
        // Gửi Access Token và Refresh Token về phía client
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 30 * 60 * 1000) // Access Token expires in 30 minutes.
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Refresh Token expires in 7 days
        });
        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during registration" });
    }
};

authController.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const isValidPassword = compareSync(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Ẩn mật khẩu để không trả về trong token
        user.password = undefined;
        // Tạo Access Token
        const accessToken = jsonwebtoken.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        // Tạo Refresh Token
        const refreshToken = jsonwebtoken.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        // Lưu Refresh vào cơ sở dữ liệu
        await userModel.saveRefreshToken(user.id, refreshToken);
        // Trả về cả Access Token và Refresh Token cho client
        res.status(200).json({
            message: "User logined successfully",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
}

authController.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Tạo và lưu token khôi phục mật khẩu
        const resetToken = await userModel.saveResetPasswordToken(email);
        // Gửi email chứa liên kiết khôi phục mật khẩu
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Please click the link to reset your password: ${resetUrl}`
        });
        res.json({ message: "Reset password link sent to email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing request" });
    }
}

authController.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        let newPassword = req.body.password;
        const salt = genSaltSync(10);
        newPassword = hashSync(newPassword, salt);
        // Xác thực token
        const user = await userModel.getUserByResetToken(token);
        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        // Đặt lại mật khẩu
        await userModel.resetPassword(user.id, newPassword);
        res.json({ message: "Password has been reset" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting password" });
    }
}

authController.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Lấy refreshToken từ cookie
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required" });
        }
        // Lấy người dùng từ database dựa trên refresh token
        const user = await userModel.getUserByRefreshToken(refreshToken);
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        // Xác minh tính hợp lệ của refresh token
        jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            // Tạo một access token mới với thời gian sống ngắn hơn
            const newAccessToken = jsonwebtoken.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
            // Trả về access token mới cho client
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(Date.now() + 30 * 60 * 1000) // Access Token expires in 30 minutes
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while refreshing token" });
    }
}

authController.logout = async (request, response) => {
    try {
        const { refreshToken } = request.cookies; // Lấy refresh token từ cookie
        if (!refreshToken) {
            return request.status(400).json({ message: "No refresh token found"});
        }
        // Xóa refresh token trong cơ sở dữ liệu
        await userModel.deleteRefreshToken(refreshToken);
        // Xóa cookie chứa accessToken và refreshToken
        response.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        response.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        response.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "An error occurred during logout"});
    }
}

module.exports = authController;