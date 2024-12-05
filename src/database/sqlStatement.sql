-- create table users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token VARCHAR(255),
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- create table notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID duy nhất của thông báo
    user_id INT NOT NULL,                     -- ID của người dùng nhận thông báo
    title VARCHAR(255) NOT NULL,              -- Tiêu đề ngắn gọn của thông báo
    message TEXT NOT NULL,                    -- Nội dung chi tiết của thông báo
    type ENUM('order', 'promotion', 'system', 'custom') DEFAULT 'custom',  
                                              -- Loại thông báo (đơn hàng, khuyến mãi, hệ thống, hoặc tùy chỉnh)
    link VARCHAR(255),                        -- Liên kết tới chi tiết liên quan (nếu có)
    is_read BOOLEAN DEFAULT FALSE,            -- Trạng thái đã đọc (true/false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                                              -- Thời gian tạo thông báo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                              -- Thời gian cập nhật thông báo
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);