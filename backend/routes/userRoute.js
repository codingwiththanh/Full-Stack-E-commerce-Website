import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  changePassword,
  getUserInfo,
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/auth.js";
import userModel from "../models/userModel.js";

const userRouter = express.Router();

// Đăng ký tài khoản người dùng mới
userRouter.post("/register", registerUser);

// Đăng nhập người dùng (trả về token nếu thành công)
userRouter.post("/login", loginUser);

// Đăng nhập tài khoản admin
userRouter.post("/admin", adminLogin);

// Lấy thông tin người dùng hiện tại từ token (dùng cho trang hồ sơ/profile)
userRouter.get("/me", verifyToken, getUserInfo);

// Đổi mật khẩu người dùng (theo ID)
userRouter.put("/:id/password", verifyToken, changePassword);

// Cập nhật tên và email người dùng (dùng trong phần chỉnh sửa tài khoản)
userRouter.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // 🔄 Cập nhật thông tin người dùng và trả lại dữ liệu mới
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Xuất router để dùng trong app chính
export default userRouter;
