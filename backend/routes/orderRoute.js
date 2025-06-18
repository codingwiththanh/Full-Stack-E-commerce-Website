import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
  updateOrderAddress,
  cancelOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Đặt đơn hàng mới (người dùng cần đăng nhập)
router.post("/place", verifyToken, placeOrder);

// Lấy danh sách đơn hàng của người dùng (cần token)
router.post("/userorders", verifyToken, userOrders);

// Lấy tất cả đơn hàng (có thể thêm middleware admin sau)
router.get("/all", verifyToken, allOrders);

// Cập nhật trạng thái đơn hàng từ admin
router.put("/status", verifyToken, updateStatus);

// Huỷ đơn hàng theo ID (người dùng huỷ đơn của mình)
router.put("/cancel/:id", verifyToken, cancelOrder);

// Cập nhật địa chỉ giao hàng cho đơn
router.put("/address", verifyToken, updateOrderAddress);

// Xoá đơn hàng (thường dùng cho admin)
router.delete("/delete", verifyToken, deleteOrder);

// Xuất router để dùng trong file chính
export default router;
