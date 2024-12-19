const profileModel = require("../models/profileModel");
const path = require('path');
const fs = require('fs'); 

const profileController = {};

profileController.getProfile = async (request, response) => {
    try {
        const userId = request.userId; // Lấy `userId` từ token đã xác thực
        const profile = await profileModel.getProfileByUserId(userId);
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

        let avatarUrl = profile.avatar_url;
        // Kiểm tra xem có file avatar mới hay không
        if (request.file) {
            // Nếu có file, tạo đường dẫn URL mới
            avatarUrl = path.join('/uploads/avatars', request.file.filename);

            // Lấy thông tin profile hiện tại từ database
            const currentProfile = await profileModel.getProfileByUserId(userId);
            const currentAvatarUrl = currentProfile[0].avatar_url;
            // Kiểm tra avatar cũ có tồn tại không và xóa file cũ
            if (currentAvatarUrl) {
                const oldAvatarPath = path.join(__dirname, '..', '..', currentAvatarUrl);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath); // Xóa file cũ
                }
            }
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