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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo thông báo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật thông báo
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo profile
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật profile
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- create table address
CREATE TABLE address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,           -- ID duy nhất của mỗi địa chỉ
    user_id INT NOT NULL,                           -- ID người dùng (liên kết với bảng users)
    name VARCHAR(255) NOT NULL,                     -- Họ và tên người nhận
    phone VARCHAR(20) NOT NULL,                     -- Số điện thoại liên hệ
    province_id INT NOT NULL,                       -- Tỉnh/Thành phố
    district_id INT NOT NULL,                       -- Quận/Huyện
    ward_id INT NOT NULL,                           -- Xã/Phường
    specific_address VARCHAR(255) NOT NULL,         -- Địa chỉ cụ thể
    country VARCHAR(100) NOT NULL DEFAULT 'Vietnam',-- Quốc gia, mặc định là Việt Nam
    is_default BOOLEAN NOT NULL DEFAULT FALSE,      -- Đánh dấu địa chỉ mặc định (true/false)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,    -- Ràng buộc khóa ngoại
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (ward_id) REFERENCES wards(id)
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

-- create table banners
CREATE TABLE banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                -- ID duy nhất cho mỗi banner
    title VARCHAR(255) NOT NULL,                         -- Tiêu đề banner
    description TEXT,                                    -- Mô tả ngắn gọn về banner
    image_url VARCHAR(500) NOT NULL,                     -- Đường dẫn URL của hình ảnh
    redirect_url VARCHAR(500),                           -- URL chuyển hướng khi click vào banner
    position ENUM('homepage', 'category', 'sidebar', 'footer', 'custom') NOT NULL,  -- Vị trí hiển thị
    display_order INT NOT NULL DEFAULT 0,                -- Thứ tự hiển thị
    start_date DATETIME NOT NULL,                        -- Ngày bắt đầu hiển thị
    end_date DATETIME,                                   -- Ngày kết thúc hiển thị
    is_active BOOLEAN NOT NULL DEFAULT TRUE,             -- Trạng thái kích hoạt banner
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       -- Thời gian cập nhật
)

-- create table categories
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                   -- ID duy nhất của danh mục
    name VARCHAR(255) NOT NULL,                             -- Tên danh mục sản phẩm
    id_query VARCHAR(100) NOT NULL UNIQUE,                  -- Mã hóa truy xuất trang (URL-friendly)
    parent_id BIGINT DEFAULT NULL,                          -- ID danh mục cha (nếu có)
    description TEXT,                                       -- Mô tả chi tiết danh mục
    image_url VARCHAR(500),                                 -- Hình ảnh đại diện cho danh mục
    display_order INT NOT NULL DEFAULT 0,                   -- Thứ tự hiển thị
    is_active BOOLEAN NOT NULL DEFAULT TRUE,                -- Trạng thái kích hoạt danh mục
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL        -- Liên kết danh mục cha
)

-- create table brands
CREATE TABLE brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                   -- ID thương hiệu
    name VARCHAR(255) NOT NULL,                             -- Tên thương hiệu
    id_query VARCHAR(100) NOT NULL UNIQUE,                  -- Mã hóa URL-friendly
    logo_url VARCHAR(500),                                  -- Đường dẫn logo thương hiệu
    description TEXT,                                       -- Mô tả thương hiệu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP      -- Thời gian cập nhật
)

-- create table products
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                   -- ID duy nhất của sản phẩm
    name VARCHAR(255) NOT NULL,                             -- Tên sản phẩm
    id_query VARCHAR(100) NOT NULL UNIQUE,                  -- Mã hóa truy xuất sản phẩm (URL-friendly)
    category_id BIGINT NOT NULL,                            -- ID danh mục của sản phẩm (liên kết bảng categories)
    brand_id BIGINT,                                        -- ID thương hiệu của sản phẩm (liên kết bảng brands)
    description TEXT,                                       -- Mô tả chi tiết sản phẩm
    price DECIMAL(15,3) NOT NULL,                           -- Giá niêm yết sản phẩm
    discount_price DECIMAL(15,3) DEFAULT NULL,              -- Giá khuyến mãi (nếu có)
    stock INT NOT NULL DEFAULT 0,                           -- Số lượng sản phẩm còn trong kho
    number_sold INT NOT NULL DEFAULT 0,                     -- Số lượng sản phẩm đã bán
    image_url VARCHAR(500),                                 -- Ảnh đại diện của sản phẩm
    gallery JSON DEFAULT NULL,                              -- Bộ sưu tập hình ảnh (nhiều hình ảnh)
    rating FLOAT DEFAULT 0.0,                               -- Đánh giá trung bình
    reviews_count INT DEFAULT 0,                            -- Số lượng đánh giá
    is_active BOOLEAN NOT NULL DEFAULT TRUE,                -- Trạng thái kích hoạt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,     -- Thời gian cập nhật
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,          -- Liên kết bảng categories
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL                 -- Liên kết bảng brands
)

-- create table product_colors
CREATE TABLE product_colors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                       -- ID duy nhất của màu sắc
    product_id BIGINT NOT NULL,                                 -- ID sản phẩm liên kết
    color_name VARCHAR(100) NOT NULL,                           -- Tên màu sắc (ví dụ: "Red", "Blue")
    color_code VARCHAR(20),                                     -- Mã màu sắc (ví dụ: "#FF0000")
    image_url VARCHAR(500),                                     -- Ảnh đại diện của màu sắc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)

-- create table product_sizes
CREATE TABLE product_sizes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                   -- ID duy nhất của kích thước
    product_id BIGINT NOT NULL,                             -- ID sản phẩm liên kết
    size_name VARCHAR(50) NOT NULL,                         -- Tên kích thước (ví dụ: "S", "M", "L", "XL")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)

-- create table product_variations 
CREATE TABLE product_variations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,                   -- ID duy nhất của biến thể
    product_id BIGINT NOT NULL,                             -- ID sản phẩm liên kết
    color_id BIGINT NOT NULL,                               -- ID màu sắc liên kết
    size_id BIGINT NOT NULL,                                -- ID kích thước liên kết
    stock INT NOT NULL DEFAULT 0,                           -- Số lượng trong kho
    price DECIMAL(15,3) DEFAULT NULL,                       -- Giá riêng cho biến thể (nếu khác giá chính)
    discount_price DECIMAL(15,3) DEFAULT NULL,              -- Giá khuyến mãi riêng cho biến thể (nếu có)
    created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,       -- Thời gian tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Thời gian cập nhật
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES product_colors(id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES product_sizes(id) ON DELETE CASCADE
)