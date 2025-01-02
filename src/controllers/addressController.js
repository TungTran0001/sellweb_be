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

addressController.getUserAddresses = async (request, response) => {
    const userId = request.userId; // Lấy userId từ token đã xác thực
    try {
        // Truy vấn danh sách địa chỉ của user
        const addresses = await addressModel.getAddressesByUserId(userId);
        if (addresses.length === 0) {
            return response.status(404).json({ message: "No addresses found for this user." });
        }
        response.status(200).json({
            message: "Addresses retrieved successfully.",
            addresses,
        });
    } catch (error) {
        console.error("Error retrieving addresses:", error);
        response.status(500).json({ message: "An error occurred while retrieving addresses." })
    }
}

addressController.updateAddress = async (request, response) => {
    const addressId = request.params.id; // Lấy ID địa chỉ từ URL
    const userId = request.userId // Lấy userId từ token
    const addressRequest = request.body;
    try {
        // Kiểm tra xem địa chỉ có thuộc về user hiện tại không
        const [address] = await addressModel.getAddressByIdAndUserId(addressId, userId);
        if (!address || address.length === 0) {
            return response.status(404).json({ message: "Address not found or not authorized." });
        }
        // Nếu isDefault = true, thiết lập tất cả các địa chỉ khác của user về false
        if (addressRequest.isDefault) {
            await addressModel.updateAddressIsdefaultIsFalseByUserId(userId);
        }
        // Cập nhật địa chỉ
       await addressModel.updateAddress(addressId, userId, addressRequest);
       const addressUpdated = await addressModel.getAddressById(addressId);
        return response.status(200).json({ 
            message: "Address updated successfully.",
            address: addressUpdated
         });
    } catch (error) {
        console.error("Error updating address: ", error);
        response.status(500).json({ message: "An error occurred while updating address."})
    }
}

addressController.deleteAddress = async (request, response) => {
    try {
        const { addressId } = request.params;
        const userId = request.userId; // Lấy từ middleware xác thực JWT

        // Kiểm tra xem địa chỉ có tồn tại và thuộc về user không
        const address = await addressModel.getAddressByIdAndUserId(addressId, userId);
        if (!address) {
            return response.status(404).json({ message: 'Address not found or unauthorized' });
        }
        // Xóa địa chỉ
        const result = await addressModel.deleteAddressByIdAndUserId(addressId, userId);
        // Kiểm tra kết quả xóa
        if (result.affectedRows === 0) {
            return response.status(400).json({ message: 'Failed to delete address' });
        }
        response.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address: ', error);
        response.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = addressController;

