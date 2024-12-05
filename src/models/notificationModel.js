const pool = require('./../../db');

const notificationModel = {};

notificationModel.findByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
        pool.query(query, [userId], (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

module.exports = notificationModel;