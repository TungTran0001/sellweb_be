const pool = require("../../db");

const wardModel = {};

wardModel.getWardsByDistrictId = (districtId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM wards WHERE district_id = ?`;
        pool.query(
            sql,
            [districtId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    });
}

module.exports = wardModel;