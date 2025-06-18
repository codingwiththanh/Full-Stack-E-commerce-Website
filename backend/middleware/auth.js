import jwt from "jsonwebtoken";

// Middleware xác thực người dùng từ token trong headers.authorization (giỏ hàng, đơn hàng)
const authUser = (req, res, next) => {
  // Lấy token từ header Authorization: Bearer <token>
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Không có token" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gắn userId vào request để sử dụng trong controller
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

// Middleware xác thực chuẩn Bearer Token (dùng cho profile, đổi mật khẩu)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra token có tồn tại và có đúng định dạng "Bearer <token>" không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token không tồn tại",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

export { authUser, verifyToken };
