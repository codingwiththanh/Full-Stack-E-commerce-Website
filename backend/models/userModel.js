import mongoose from "mongoose";

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }, // Tên người dùng

    email: {
      type: String,
      required: true,
      unique: true,
    }, // Email người dùng (phải duy nhất)

    password: {
      type: String,
      required: true,
    }, // Mật khẩu đã mã hoá (bằng bcrypt)

    cartData: {
      type: Object,
      default: {},
    }, // Giỏ hàng của người dùng, lưu theo dạng: { productId: { size: quantity, ... }, ... }
  },
  {
    minimize: false, // Đảm bảo lưu cả object rỗng trong MongoDB
  }
);

// Tạo model, tránh tạo lại nếu đã tồn tại
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
