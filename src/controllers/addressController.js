const addressModel = require("../models/addressModel");

const addressController = {};

addressController.createAddress = async (request, response) => {
    const address = request.body;
    const userId = request.userId; // Lấy userId từ token đã xác thực
    try {
        // Kiểm tra thông tin bắt buộc
        if (!address.name || !address.phone || !address.provinceId || !address.districtId || !address.wardId || !address.specificAddress) {
            return response.status(400).json({ message: "All fields are required." });
        }
        // Kiểm tra nếu `isDefault` là true, cập nhật các địa chỉ khác không còn là mặc định
        if (address.isDefault) {
            await addressModel.updateAddressIsdefaultIsFalseByUserId(userId);
        }
        // Tạo địa chỉ mới
        const result = await addressModel.create(userId, address);
        const newAddress = await addressModel.getAddressById(result.insertId);
        response.status(201).json({
            message: "Address created successfully",
            newAddress: newAddress,
        });
    } catch (error) {
        console.error("Error creating address:", error);
        response.status(500).json({ message: "An error occurred while creating address."})
    }
}

module.exports = addressController;

