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
        );
    })
}

bannerModel.getHomePageBanners = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, title, description, image_url, redirect_url, display_order, start_date, end_date
            FROM banners
            WHERE position = 'homepage'
            AND is_active = true
            AND start_date <= NOW()
            AND (end_date IS NULL OR end_date >= NOW())
            ORDER BY display_order ASC
        `;
        pool.query(
            sql,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
}

module.exports = bannerModel;