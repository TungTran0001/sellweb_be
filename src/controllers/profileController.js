const profileModel = require("../models/profileModel");

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

module.exports = profileController;