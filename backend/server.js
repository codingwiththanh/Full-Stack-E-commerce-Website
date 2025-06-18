import express from "express";
import cors from "cors";
import "dotenv/config"; // Load biến môi trường từ .env

// Kết nối cơ sở dữ liệu MongoDB & Cloudinary
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Import các tuyến API
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Cấu hình App
const app = express();
const port = process.env.PORT || 4000;

console.log("Tài khoản Admin:", process.env.ADMIN_EMAIL);
console.log("Mật khẩu:", process.env.ADMIN_PASSWORD);

// Kết nối CSDL và dịch vụ lưu trữ ảnh
connectDB();
connectCloudinary();

// Cấu hình middleware
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ body request
app.use(cors()); // Cho phép CORS (giao tiếp từ frontend)

// Định tuyến API chính
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Route test API gốc
app.get("/", (req, res) => {
  res.send("API Đang chạy");
});

// ▶Khởi chạy server
app.listen(port, () => console.log(`Server đang chạy PORT: ${port}`));


