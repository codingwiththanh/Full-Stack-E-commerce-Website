import express from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  updateProduct,
  singleProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js"; // Middleware để xử lý upload file từ form
import adminAuth from "../middleware/adminAuth.js"; // Middleware xác thực admin

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const productRouter = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// API: Upload ảnh bằng Cloudinary từ bộ nhớ RAM (dành cho ảnh preview, avatar, nhanh gọn)
const memoryUpload = multer({ storage: multer.memoryStorage() });
productRouter.post(
  "/upload",
  adminAuth,
  memoryUpload.single("image"),
  async (req, res) => {
    try {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      res.json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Upload thất bại" });
    }
  }
);

// Thêm sản phẩm mới (gồm 4 ảnh upload)
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Cập nhật hình ảnh sản phẩm (đặt riêng route nếu bạn muốn upload lại ảnh)
productRouter.post(
  "/update-img",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

// Xoá sản phẩm (admin)
productRouter.post("/remove", adminAuth, removeProduct);

// Cập nhật thông tin sản phẩm (không thay ảnh)
productRouter.post("/update", adminAuth, updateProduct);

// Lấy thông tin chi tiết 1 sản phẩm (dùng trong edit product)
productRouter.post("/single", singleProduct);

// Lấy danh sách toàn bộ sản phẩm
productRouter.get("/list", listProducts);

export default productRouter;
