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

router.post("/place", verifyToken, placeOrder);
router.post("/userorders", verifyToken, userOrders);
router.get("/all", verifyToken, allOrders); // Thêm middleware admin nếu cần
router.put("/status", verifyToken, updateStatus);
router.put("/cancel/:id", verifyToken, cancelOrder);
router.put("/address", verifyToken, updateOrderAddress);
router.delete("/delete", verifyToken, deleteOrder);

export default router;
