import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.userId;

        if (!itemId || !size) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin sản phẩm hoặc size." });
        }

        const userData = await userModel.findById(userId);
        let cartData = userData?.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// update user cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.userId;

        if (!itemId || !size || quantity == null) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu cập nhật." });
        }

        const userData = await userModel.findById(userId);
        let cartData = userData?.cartData || {};

        if (!cartData[itemId]) cartData[itemId] = {};
        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// get user cart data
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("🧪 Controller getUserCart, req.userId =", req.userId);

        const userData = await userModel.findById(userId);
        const cartData = userData?.cartData || {};

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };
