import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 Ở hàm adminLogin, bạn đã tạo token từ email + password như chuỗi:
    // jwt.sign(email + password, SECRET)
    // => thì ở đây cần so sánh lại với cùng chuỗi như vậy
    const expected = jwt.sign(
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
      process.env.JWT_SECRET
    );

    if (token !== expected) {
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    next();
  } catch (error) {
    console.error("adminAuth error:", error);
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

export default adminAuth;
