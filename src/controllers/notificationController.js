const notificationModel = require("../models/notificationModel");

const notificationController = {};

notificationController.getNotifications = async (request, response) => {
    const userId = request.userId; // Lấy `userId` từ token đã xác thực
    try {
        const notifications = await notificationModel.findByUserId(userId);
        response.status(200).json({ data: notifications });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error retrieving notifications" });
    }
}

module.exports = notificationController;