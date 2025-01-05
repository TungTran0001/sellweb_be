const path = require("path");
const bannerModel = require("../models/bannerModel");

const bannerController = {};

bannerController.createBanner = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({ message: "Banner image is required" });
        }

        const { title, description, redirect_url, position, display_order, start_date, end_date, is_active } = request.body;
        const imageUrl = path.join('/uploads/banners', request.file.filename);
        const newBanner = {
            title,
            description,
            image_url: imageUrl,
            redirect_url,
            position,
            display_order,
            start_date,
            end_date,
            is_active
        }

        // Lưu thông tin banner vào database
        const result = await bannerModel.createBanner(newBanner);
        response.status(201).json({
            message: "Banner created successfully",
            banner: { id: result.insertId, ...newBanner },
        });
    } catch (error) {
        console.error("Error creating banner: ", error);
        response.status(500).json({ message: "Internal server error" });
    }
}

bannerController.getHomePageBanners = async (request, response) => {
    try {
        const banners = await bannerModel.getHomePageBanners();
        response.status(200).json({
            message: "Home page banners fetched successfully",
            banners,
        });
    } catch (error) {
        console.error('Error fetching banners: ', error);
        response.status(500).json({ message: "An error occurred while fetching banners" });
    }
}

module.exports = bannerController;