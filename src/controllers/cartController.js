const pool = require("../config/db");
const cartItemModel = require("../models/cartItemModel");
const cartController = {};

cartController.addToCart = async (req, res) => {
    try {
        const { product_id, color_id, size_id, quantity, price, total_price } = req.body;
        const user_id = req.userId;
        // Kiểm tra nếu có giá trị undefined
        if (!product_id || !quantity || !price || !total_price) {
            return res.status(400).json({message: "Thiếu dữ liệu đầu vào!"});
        }
        // Kiểm tra xem giỏ hàng của user có tồn tại không
        let [cart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
        if (cart.length === 0) {
            // Nếu chưa có giỏ hàng, tạo mới
            const [newCart] = await pool.execute("INSERT INTO cart (user_id) VALUES (?)", [user_id]);
            cart = [{ id: newCart.insertId }];
        }
        const cart_id = cart[0].id;

        // // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const [existingItem] = await pool.execute(
            `SELECT id, quantity, total_price FROM cart_items
            WHERE cart_id = ? AND product_id = ? AND (color_id IS NULL OR color_id = ?)
            AND (size_id IS NULL OR size_id = ?)`,
            [cart_id, product_id, color_id, size_id]
        );
        if (existingItem.length > 0) {
             // Nếu đã có sản phẩm trong giỏ hàng, cập nhật số lượng
             const newQuantity = existingItem[0].quantity + quantity;
             const newTotalPrice = parseFloat(existingItem[0].total_price) + total_price;
             await pool.execute(
                "UPDATE cart_items SET quantity = ?, total_price = ? WHERE id = ?",
                [newQuantity, newTotalPrice, existingItem[0].id]
             );
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            const newCartItem = {
                cart_id,
                product_id,
                color_id,
                size_id,
                quantity,
                price,
                total_price
            }
            await cartItemModel.addItemToCart(newCartItem);
        }

        // Cập nhật tổng giá trị giỏ hàng
        await pool.execute(
            `UPDATE cart SET total_price = (SELECT SUM(total_price) FROM cart_items WHERE cart_id = ?)
            WHERE id = ?`,
            [cart_id, cart_id]
        )
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được thêm vào giỏ hàng.",
        });
    } catch (error) {
        console.error("Error creating cart: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = cartController;