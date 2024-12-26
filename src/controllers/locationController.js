const districtModel = require("../models/districtModel");
const provinceModel = require("../models/provinceModel");
const wardModel = require("../models/wardModel");

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

locationController.getDistricts = async (request, response) => {
    try {
        const { provinceId } = request.params;
        const districts = await districtModel.getDistrictByProvinceId(provinceId);
        response.status(200).json(districts);
    } catch (error) {
        console.error("Error fetching districts:", error);
        response.status(500).json({ message: "Server error"});
    }
}

locationController.getWards = async (request, response) => {
    try {
        const { districtId } = request.params;
        const wards = await wardModel.getWardsByDistrictId(districtId);
        response.status(200).json(wards);
    } catch (error) {
        console.error("Error fetching wards:", error);
        response.status(500).json({ message: "Server error"});
    }
}

module.exports = locationController;