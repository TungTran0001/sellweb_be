const pool = require('./../../db');

const profileModel = {};

profileModel.getProfileByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT users.email, profiles.full_name, profiles.phone_number, profiles.gender, profiles.date_of_birth, profiles.address, profiles.avatar_url 
                      FROM profiles 
                      INNER JOIN users ON profiles.user_id = users.id WHERE users.id = ?`;
        pool.query(
            query,
            [userId],
            (error, result) => {
                if(error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    })
}

profileModel.createProfile = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO profiles (user_id, full_name, phone_number, gender, date_of_birth, address, avatar_url, created_at, updated_at)
            VALUE (?, '', '', '', ?, '', '', NOW(), NOW())
        `
        pool.query(
            query,
            [userId, null],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    });
}

profileModel.updateProfile = (userId, profile, avatarUrl) => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE profiles
        SET full_name = ?, phone_number = ?, gender = ?, date_of_birth = ?, address = ?, avatar_url = ?, updated_at = NOW()
        WHERE user_id = ?
        `;
        pool.query(
            sql,
            [profile.full_name, profile.phone_number, profile.gender, profile.date_of_birth, profile.address, avatarUrl, userId],
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        )
    });
}

module.exports = profileModel;