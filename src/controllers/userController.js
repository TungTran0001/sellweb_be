const userModel = require('./../models/userModel');

const userController = {};

userController.getUserHeaderInfo = async (request, response) => {
    try {
        const userId = request.userId; // Lấy từ token đã xác thực
        const userHeaderInfo = await userModel.getHeaderInfo(userId);
        if (!userHeaderInfo.length) {
            return response.status(404).json({ message: "User not found" });
        }
        const { username, full_name, avatar_url } = userHeaderInfo[0];
        response.status(200).json({
            avatar_url,
            displayName: full_name || username // Ưu tiên fullname, nếu không có thì hiển thị username
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Server error" });
    }
}

module.exports = userController;