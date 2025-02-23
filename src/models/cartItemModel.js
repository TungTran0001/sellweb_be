const pool = require("../config/db");
const cartItemModel = {};

// Thêm sản phẩm vào giỏ hàng
cartItemModel.addItemToCart = async (newCartItem) => {
    const sql = `INSERT INTO cart_items (cart_id, product_id, color_id, size_id, quantity, price, total_price) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`
    const [result] = await pool.execute(
        sql,
        [newCartItem.cart_id, newCartItem.product_id, newCartItem.color_id, newCartItem.size_id, newCartItem.quantity, newCartItem.price, newCartItem.total_price]
    );
    return result.insertId;
}

module.exports = cartItemModel;