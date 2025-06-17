import orderModel from "../models/orderModel.js"; // ✅ Đúng

import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// Global variables
const currency = "VND";
const deliveryCharge = 30000; 

// Hàm sinh mã đơn hàng duy nhất
const generateOrderCode = () => {
  return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentMethod, payment } = req.body;

    console.log("📦 Dữ liệu nhận từ frontend:", req.body);

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Danh sách sản phẩm không hợp lệ!" });
    }
    if (typeof address !== "object" || !address.email || !address.dienThoai) {
      return res
        .status(400)
        .json({ success: false, message: "Địa chỉ giao hàng không hợp lệ!" });
    }
    if (!amount || isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: "Số tiền không hợp lệ!" });
    }
    if (!paymentMethod || typeof paymentMethod !== "string") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Phương thức thanh toán không hợp lệ!",
        });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });
    }

    const validMethods = ["cod", "napas"];
    if (!validMethods.includes(paymentMethod)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Phương thức thanh toán không hợp lệ.",
        });
    }

    let totalAmount = 0;
    const validItems = [];
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Sản phẩm ${item._id} không tồn tại.`,
          });
      }
      if (item.quantity <= 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Số lượng sản phẩm ${item._id} không hợp lệ.`,
          });
      }
      totalAmount += product.price * item.quantity;
      validItems.push({
        productId: item._id,
        size: item.size,
        quantity: item.quantity,
      });
    }

    if (totalAmount + deliveryCharge !== amount) {
      return res.status(400).json({
        success: false,
        message: `Tổng tiền không khớp. Nhận: ${amount}, Dự kiến: ${
          totalAmount + deliveryCharge
        }`,
      });
    }

    const requiredFields = [
      "ten",
      "ho",
      "email",
      "duongSonha",
      "phuongXa",
      "dienThoai",
    ];
    for (const field of requiredFields) {
      if (!address[field]) {
        return res
          .status(400)
          .json({ success: false, message: `Thiếu trường địa chỉ: ${field}` });
      }
    }

    if (!/^\d{10}$/.test(address.dienThoai)) {
      return res
        .status(400)
        .json({ success: false, message: "Số điện thoại phải có 10 chữ số." });
    }

    if (!/\S+@\S+\.\S+/.test(address.email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không hợp lệ." });
    }

    if (paymentMethod === "napas") {
      return res
        .status(501)
        .json({
          success: false,
          message: "Phương thức thanh toán Napas chưa được hỗ trợ.",
        });
    }

    const orderData = {
      userId,
      items: validItems,
      address,
      amount,
      paymentMethod,
      payment: payment ?? false, // ✅ Ghi đúng giá trị payment từ frontend
      date: Date.now(),
      orderCode: generateOrderCode(),
      status: "Đã đặt hàng",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Cập nhật giỏ hàng người dùng
    let cartData = user.cartData || {};
    for (const item of items) {
      if (cartData[item._id]) {
        delete cartData[item._id][item.size];
        if (Object.keys(cartData[item._id]).length === 0) {
          delete cartData[item._id];
        }
      }
    }
    await userModel.findByIdAndUpdate(userId, { cartData });

    console.log("✅ Đơn hàng đã được lưu:", newOrder._id);
    res.json({
      success: true,
      message: "Đã đặt hàng",
      orderId: newOrder._id,
      updatedCartData: cartData,
    });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// User Order Data For Frontend
const userOrders = async (req, res) => {
  console.log("🛒 Nhận request lấy đơn hàng người dùng:", req.userId);
  try {
    const userId = req.userId;
    const orders = await orderModel
      .find({ userId })
      .populate("items.productId")
      .sort({ date: -1 });

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      items: order.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        price: item.productId.price,
        size: item.size,
        quantity: item.quantity,
      })),
      address: order.address,
      amount: order.amount,
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.date,
      orderCode: order.orderCode,
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("items.productId")
      .sort({ date: -1 });

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      items: order.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        price: item.productId.price,
        size: item.size,
        quantity: item.quantity,
      })),
      address: order.address,
      amount: order.amount,
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.date,
      orderCode: order.orderCode,
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error in allOrders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const allowedStatuses = [
      "Đã đặt hàng",
      "Chờ đóng gói",
      "Đã gửi hàng",
      "Đang giao hàng",
      "Đã giao hàng",
      "Đã huỷ",
    ];

    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Đã cập nhật trạng thái" });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete order from Admin Panel
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Đã xóa đơn hàng" });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order address from Admin Panel
const updateOrderAddress = async (req, res) => {
  try {
    const { orderId, newAddress } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { address: newAddress });
    res.json({ success: true, message: "Cập nhật địa chỉ thành công" });
  } catch (error) {
    console.error("Error in updateOrderAddress:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    if (!["Đã đặt hàng", "Chờ đóng gói"].includes(order.status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Không thể huỷ đơn hàng ở trạng thái này",
        });
    }

    order.status = "Đã huỷ";
    await order.save();
    res.json({ success: true, message: "Đơn hàng đã được huỷ" });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
  updateOrderAddress,
  cancelOrder,
};
