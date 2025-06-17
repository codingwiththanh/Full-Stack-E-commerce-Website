// Xác thực thông qua token trong headers.token (DÙNG CHO GIỎ HÀNG, ĐƠN HÀNG)
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Lấy từ Authorization

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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Token không tồn tại" });
  }

  const token = authHeader.split(" ")[1];

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
