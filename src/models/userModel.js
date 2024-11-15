const pool = require('./../../db');
const userModel = {};
const crypto = require('crypto');

userModel.create = (user) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [user.userName, user.email, user.password], (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
};

userModel.saveRefreshToken = async (userId, refreshToken) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE users SET refresh_token = ? WHERE id = ?",
            [refreshToken, userId],
            (error) => {
                if (error) return reject(error);
                resolve();
            }
        )
    });
};

userModel.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ?', [email], (error, users) => {
            if (error) {
                reject(error);
            }
            resolve(users[0]);
        });
    });
};

userModel.saveResetPasswordToken = (email) => {
    return new Promise((resolve, reject) => {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // Token hết hạn sau 15 phút
        pool.query(
            "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
            [resetToken, expiry, email],
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(resetToken) // Trả về token để gửi email cho người dùng
            }
        )
    });
}

userModel.getUserByResetToken = (token) => {
    return new Promise((resolve, reject) => {
        const currentTime = new Date();
        pool.query(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
            [token, currentTime],
            (error, users) => {
                if (error) return reject(error);
                resolve(users[0]);
            }
        );
    });
}

userModel.getUserByRefreshToken = async (refreshToken) => {
    const [user] = await pool.query("SELECT * FROM users WHERE refresh_token = ?", [refreshToken]);
    return user;
};

userModel.resetPassword = (id, newPassword) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
            [newPassword, id],
            (error) => {
                if (error) return reject(error);
                resolve();
            }
        )
    });
}

userModel.deleteRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        pool.query(
            "UPDATE users SET refresh_token = NULL WHERE refresh_token = ?", 
            [refreshToken],
            (error) => {
                if (error) return reject(error);
                resolve();
            }
        );
    });
};

module.exports = userModel;