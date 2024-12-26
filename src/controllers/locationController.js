const provinceModel = require("../models/provinceModel");

const locationController = {}

locationController.getProvinces = async (request, response) => {
    try {
        const provinces = await provinceModel.getAllProvince();
        response.status(200).json(provinces);
    } catch (error) {
        console.error("Error fetching provinces:", error);
        response.status(500).json({ message: "Server error" });
    }
}

module.exports = locationController;