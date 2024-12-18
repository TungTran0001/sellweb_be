const profileModel = require("../models/profileModel");
const path = require('path');

const profileController = {};

profileController.getProfile = async (request, response) => {
    try {
        const userId = request.userId; // Lấy `userId` từ token đã xác thực
        const profile = await profileModel.findByUserId(userId);
        response.status(200).json({ profile: profile });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error retrieving profile" });
    }
}

profileController.updateProfile = async (request, response) => {
    try {
        const profile = request.body;
        console.log(profile);
        const userId = request.userId; // Lấy `userId` từ token đã xác thực
        let avatarUrl = null;
        if (request.file) {
            // Nếu có file, tạo đường dẫn URL
            avatarUrl = path.join('/uploads/avatars', request.file.filename);
        }
        // Cập nhập profile qua model
        await profileModel.updateProfile(userId, profile, avatarUrl);
        response.status(200).json({
            message: "Profile updated successfully",
            profile: profile
        })
    } catch (error) {
        console.error("Lỗi: " + error);
        response.status(500).json({ message: "An error occurred while updating profile" });
    }
}

module.exports = profileController;