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
    });
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
        const sql = `SELECT a.id, a.name, a.phone, p.name AS province, d.name AS district, w.name AS ward, a.specific_address, a.is_default 
                    FROM address AS a
                    JOIN provinces AS p ON a.province_id = p.id
                    JOIN districts AS d ON a.district_id = d.id
                    JOIN wards AS w ON a.ward_id = w.id
                    WHERE a.id = ?`;
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
    });
}

addressModel.getAddressesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT a.id, a.name, a.phone, p.name AS province, d.name AS district, w.name AS ward, a.specific_address, a.is_default
                    FROM address AS a
                    JOIN provinces AS p ON a.province_id = p.id
                    JOIN districts AS d ON a.district_id = d.id
                    JOIN wards AS w ON a.ward_id = w.id
                    WHERE a.user_id = ?
                    ORDER BY a.is_default DESC, a.id ASC`;
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
    });
}

addressModel.getAddressByIdAndUserId = (id, userId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM address WHERE id = ? AND user_id = ?`;
        pool.query(
            sql,
            [id, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    });
}

addressModel.updateAddress = (addressId, userId, address) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE address SET name = ?, phone = ?, province_id = ?, district_id = ?, ward_id = ?, specific_address = ?, is_default = ?
                    WHERE id = ? AND user_id = ?`;
        pool.query(
            sql,
            [address.name, address.phone, address.provinceId, address.districtId, address.wardId, address.specificAddress, address.isDefault, addressId, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    })
}

addressModel.deleteAddressByIdAndUserId = (addressId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM address WHERE id = ? AND user_id = ?`;
        pool.query(
            query,
            [addressId, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
    });
}

module.exports = addressModel;