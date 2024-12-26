const pool = require("../../db");

const provinceModel = {};

provinceModel.getAllProvince = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM provinces`;
        pool.query(
            sql,
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    })
}

module.exports = provinceModel;