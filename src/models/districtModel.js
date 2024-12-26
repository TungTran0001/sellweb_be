const pool = require("../../db");

const districtModel = {};

districtModel.getDistrictByProvinceId = (provinceId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM districts WHERE province_id = ?`;
        pool.query(
            sql,
            [provinceId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    });
}

module.exports = districtModel;