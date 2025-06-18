import userModel from "../models/userModel.js";

// Thêm sản phẩm vào giỏ hàng người dùng
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    // ⚠️ Kiểm tra thông tin sản phẩm và size
    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin sản phẩm hoặc size.",
      });
    }

    const userData = await userModel.findById(userId);
    let cartData = userData?.cartData || {};

    //  Nếu sản phẩm đã có trong giỏ, tăng số lượng
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      //  Nếu chưa có, khởi tạo entry mới
      cartData[itemId] = { [size]: 1 };
    }

    //  Cập nhật giỏ hàng trong database
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    //  Kiểm tra dữ liệu đầu vào
    if (!itemId || !size || quantity == null) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu dữ liệu cập nhật." });
    }

    const userData = await userModel.findById(userId);
    let cartData = userData?.cartData || {};

    //  Nếu sản phẩm chưa tồn tại, khởi tạo
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;

    //  Cập nhật lại giỏ hàng trong DB
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Lấy dữ liệu giỏ hàng của người dùng
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    const cartData = userData?.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
