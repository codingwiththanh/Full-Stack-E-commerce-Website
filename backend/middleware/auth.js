// ✅ File: middleware/auth.js
import jwt from 'jsonwebtoken';

// Xác thực thông qua token trong headers.token (DÙNG CHO GIỎ HÀNG, ĐƠN HÀNG)
const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // ✅ Đảm bảo userId luôn có mặt
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token Invalid' });
    }
};

// Xác thực chuẩn Bearer Token (DÙNG CHO PROFILE, MẬT KHẨU)
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc thiếu.' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // ✅ Thống nhất
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

export { authUser, verifyToken };
