const slugify = (name) => {
    return name
        .toLowerCase()
        .normalize("NFD") // Chuẩn hóa Unicode
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
        .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, "-") // Loại bỏ dấu gạch ngang thừa
        .trim();
};

module.exports = {
    slugify
};