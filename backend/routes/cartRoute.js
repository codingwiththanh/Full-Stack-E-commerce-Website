import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import { authUser } from "../middleware/auth.js";

const cartRouter = express.Router();

// Lấy dữ liệu giỏ hàng của người dùng (cần token xác thực)
cartRouter.post("/get", authUser, getUserCart);

// Thêm sản phẩm vào giỏ hàng (cần token xác thực)
cartRouter.post("/add", authUser, addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng (cần token xác thực)
cartRouter.post("/update", authUser, updateCart);

// Xuất router để dùng trong app chính
export default cartRouter;
