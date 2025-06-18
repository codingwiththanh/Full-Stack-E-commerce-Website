import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

//  Tạo JWT token từ userId
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//  Đăng nhập người dùng thường
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Đăng ký người dùng mới
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Đăng nhập admin (sử dụng tài khoản môi trường)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Đổi mật khẩu người dùng theo ID
const changePassword = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json("Người dùng không tồn tại");

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) return res.status(400).json("Mật khẩu hiện tại không đúng");

    const hashed = await bcrypt.hash(req.body.newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json("Đổi mật khẩu thành công");
  } catch (err) {
    res.status(500).json(err.message || "Đã xảy ra lỗi");
  }
};

// Lấy thông tin cơ bản người dùng (tên và email)
const getUserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("name email");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });

    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Không thể lấy thông tin người dùng" });
  }
};

export { loginUser, registerUser, adminLogin, changePassword, getUserInfo };
