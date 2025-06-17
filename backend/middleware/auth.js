// Xác thực thông qua token trong headers.token (DÙNG CHO GIỎ HÀNG, ĐƠN HÀNG)
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  let token = req.headers.token;

  // Nếu không có trong headers.token thì thử lấy từ Authorization
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("🔑 Token nhận được:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Xác thực chuẩn Bearer Token (DÙNG CHO PROFILE, MẬT KHẨU)
const verifyToken = (req, res, next) => {
  let token = req.headers.token;

  // Nếu không có token trong headers.token thì thử lấy từ Authorization
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ Log ra trước khi kiểm tra
  console.log("🧪 Token (headers.token):", req.headers.token);
  console.log("🧪 Token (authorization):", req.headers.authorization);
  console.log("🧪 Token used for verify:", token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token không tồn tại" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Token không hợp lệ" });
  }
};

export { authUser, verifyToken };
