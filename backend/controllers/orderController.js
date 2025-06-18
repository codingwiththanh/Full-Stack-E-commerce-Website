import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const currency = "VND";
const deliveryCharge = 30000;

// Hàm sinh mã đơn hàng ngẫu nhiên, có thể thay bằng generator thực tế sau này
const generateOrderCode = () => {
  return "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// API đặt hàng (COD)
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentMethod, payment } = req.body;

    // Kiểm tra dữ liệu đầu vào
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

    // Tính tổng tiền thực tế và xác minh sản phẩm
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

    // Kiểm tra các trường địa chỉ bắt buộc
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

    // Validate email và số điện thoại
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

    //  Hệ thống chưa hỗ trợ Napas
    if (paymentMethod === "napas") {
      return res
        .status(501)
        .json({
          success: false,
          message: "Phương thức thanh toán Napas chưa được hỗ trợ.",
        });
    }

    // Tạo đơn hàng mới
    const orderData = {
      userId,
      items: validItems,
      address,
      amount,
      paymentMethod,
      payment: payment ?? false,
      date: Date.now(),
      orderCode: generateOrderCode(),
      status: "Đã đặt hàng",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 🧹 Xoá sản phẩm đã đặt khỏi giỏ hàng
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

    res.json({
      success: true,
      message: "Đã đặt hàng",
      orderId: newOrder._id,
      updatedCartData: cartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả đơn hàng của người dùng (hiển thị lịch sử mua)
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel
      .find({ userId })
      .populate("items.productId")
      .sort({ date: -1 });

    // Định dạng lại dữ liệu để client dễ xử lý
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dành cho admin: lấy tất cả đơn hàng
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin cập nhật trạng thái đơn hàng
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
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Xoá đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Đã xóa đơn hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Cập nhật địa chỉ giao hàng
const updateOrderAddress = async (req, res) => {
  try {
    const { orderId, newAddress } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { address: newAddress });
    res.json({ success: true, message: "Cập nhật địa chỉ thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Huỷ đơn hàng (chỉ khi trạng thái là "Đã đặt hàng" hoặc "Chờ đóng gói")
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
