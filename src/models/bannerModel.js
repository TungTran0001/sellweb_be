const pool = require("../../db");

const bannerModel = {};

bannerModel.createBanner = (bannerData) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO banners (title, description, image_url, redirect_url, position, display_order, start_date, end_date, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            bannerData.title,
            bannerData.description,
            bannerData.image_url,
            bannerData.redirect_url,
            bannerData.position,
            bannerData.display_order,
            bannerData.start_date,
            bannerData.end_date,
            bannerData.is_active,
        ];
        pool.query(
            sql,
            values,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        )
    })
}

module.exports = bannerModel;