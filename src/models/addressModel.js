const pool = require("../../db");

const addressModel = {};

addressModel.updateAddressIsdefaultIsFalseByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE address SET is_default = FALSE WHERE user_id = ?`;
        pool.query(
            sql,
            [userId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    })
}

addressModel.create = (userId, address) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO address (user_id, name, phone, province_id, district_id, ward_id, specific_address, is_default) VALUE (?, ?, ?, ?, ?, ?, ?, ?)`;
        pool.query(
            sql,
            [userId, address.name, address.phone, address.provinceId, address.districtId, address.wardId, address.specificAddress, address.isDefault],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    });
}

addressModel.getAddressById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM address WHERE id = ?`;
        pool.query(
            sql,
            [id],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    })
}

module.exports = addressModel;