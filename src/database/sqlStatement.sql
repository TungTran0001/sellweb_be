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

-- create table profiles
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID duy nhất của profile
    user_id INT NOT NULL,                     -- Liên kết đến bảng users
    full_name VARCHAR(255) NOT NULL,          -- Họ và tên người dùng
    phone_number VARCHAR(15),                 -- Số điện thoại
    gender ENUM('male', 'female', 'other'),   -- Giới tính
    date_of_birth DATE,                       -- Ngày sinh
    address TEXT,                             -- Địa chỉ chi tiết
    avatar_url VARCHAR(255),                  -- URL ảnh đại diện
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                                              -- Thời gian tạo profile
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
                                              -- Thời gian cập nhật profile
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- create table address
CREATE TABLE address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,           -- ID duy nhất của mỗi địa chỉ
    user_id INT NOT NULL,                           -- ID người dùng (liên kết với bảng users)
    full_name VARCHAR(100) NOT NULL,                -- Họ và tên người nhận
    phone_number VARCHAR(15) NOT NULL,              -- Số điện thoại liên hệ
    city VARCHAR(100) NOT NULL,                     -- Tỉnh/Thành phố
    district VARCHAR(100),                          -- Quận/Huyện
    ward VARCHAR(100),                           -- Xã/Phường
    specific_address VARCHAR(255) NOT NULL,         -- Địa chỉ cụ thể
    postal_code VARCHAR(20) NOT NULL,                -- Mã bưu chính
    country VARCHAR(100) NOT NULL DEFAULT 'Vietnam', -- Quốc gia, mặc định là Việt Nam
    is_default BOOLEAN NOT NULL DEFAULT FALSE,      -- Đánh dấu địa chỉ mặc định (true/false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE    -- Ràng buộc khóa ngoại
);


-- create table provinces
CREATE TABLE provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,        -- ID tỉnh/thành phố
    name VARCHAR(100) NOT NULL,               -- Tên tỉnh/thành phố
    code VARCHAR(10) UNIQUE NOT NULL          -- Mã tỉnh (VD: 01, 79)
);

-- create table districts
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID quận/huyện
    name VARCHAR(100) NOT NULL,                -- Tên quận/huyện
    code VARCHAR(10) UNIQUE NOT NULL,          -- Mã quận/huyện (VD: 001, 002)
    province_id INT NOT NULL,                  -- Liên kết tỉnh/thành phố
    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
)

-- create table wards
CREATE TABLE wards (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID xã/phường
    name VARCHAR(100) NOT NULL,                 -- Tên xã/phường
    code VARCHAR(10) UNIQUE NOT NULL,           -- Mã xã/phường (VD: 00001, 00002)
    district_id INT NOT NULL,                   -- Liên kết quận/huyện
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
)