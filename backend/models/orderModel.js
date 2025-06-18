import mongoose from "mongoose";

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  }, // ID người dùng đặt hàng

  orderCode: {
    type: String,
    required: true,
    unique: true,
  }, // Mã đơn hàng duy nhất

  items: [
    // Danh sách sản phẩm trong đơn hàng
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Tham chiếu tới model Product
        required: true,
      },
      size: {
        type: String,
        required: true,
      }, // Size của sản phẩm
      quantity: {
        type: Number,
        required: true,
      }, // Số lượng
    },
  ],

  amount: {
    type: Number,
    required: true,
  }, // Tổng tiền (bao gồm cả phí giao hàng)

  address: {
    // Thông tin người nhận
    ten: String,
    ho: String,
    email: String,
    duongSonha: String,
    phuongXa: String,
    quanHuyen: String,
    thanhPho: String,
    dienThoai: String,
  },

  status: {
    type: String,
    required: true,
    default: "Đã đặt hàng",
  }, // Trạng thái đơn hàng

  paymentMethod: {
    type: String,
    required: true,
  }, // Phương thức thanh toán (VD: cod, napas)

  payment: {
    type: Boolean,
    required: true,
    default: false,
  }, // Trạng thái thanh toán (đã/ chưa)

  date: {
    type: Number,
    required: true,
  }, // Ngày tạo đơn hàng (timestamp)
});

// Tạo model, tránh tạo lại nếu đã tồn tại
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
