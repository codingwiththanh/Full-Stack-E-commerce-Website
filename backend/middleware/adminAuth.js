import jwt from "jsonwebtoken";

// Middleware xác thực quyền admin thông qua token
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Kiểm tra xem có Authorization header không và có bắt đầu bằng "Bearer " không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
      });
    }

    // Lấy token từ header
    const token = authHeader.split(" ")[1];

    // Giải mã token để xác thực (chủ yếu để phát hiện lỗi định dạng hoặc hết hạn)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tạo lại chuỗi token đúng bằng cách đã mã hoá trong hàm adminLogin
    // Vì adminLogin dùng jwt.sign(email + password), nên phải đối chiếu lại như vậy
    const expected = jwt.sign(
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD,
      process.env.JWT_SECRET
    );

    // So sánh token đang dùng với token hợp lệ được tạo lại từ email+password
    if (token !== expected) {
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    // Nếu hợp lệ, cho phép đi tiếp
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn.",
    });
  }
};

export default adminAuth;
