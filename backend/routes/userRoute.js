import express from 'express';
import {
    loginUser,
    registerUser,
    adminLogin,
    changePassword,
    getUserInfo
} from '../controllers/userController.js';

import { verifyToken} from "../middleware/auth.js";
import userModel from '../models/userModel.js';


const userRouter = express.Router();

// Đăng ký tài khoản
userRouter.post('/register', registerUser);

// Đăng nhập tài khoản
userRouter.post('/login', loginUser);

// Đăng nhập admin
userRouter.post('/admin', adminLogin);

// Lấy thông tin người dùng hiện tại (dùng trong /profile)
userRouter.get('/me', verifyToken, getUserInfo);

// Đổi mật khẩu
userRouter.put('/:id/password', verifyToken, changePassword);

userRouter.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await userModel.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default userRouter;
