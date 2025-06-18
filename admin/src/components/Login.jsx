import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

// Component form đăng nhập admin
const Login = ({ setToken }) => {
  // State quản lý email và password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Xử lý submit form đăng nhập
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng nhập đến API
      const response = await axiosInstance.post("/api/user/admin", {
        email,
        password,
      });

      // Kiểm tra kết quả API
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Xử lý lỗi API
      console.error("Lỗi đăng nhập:", error);
      toast.error(error.message || "Đăng nhập thất bại");
      // Có thể thêm gửi lỗi đến hệ thống log
    }
  };

  return (
    // Container căn giữa màn hình
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <form onSubmit={onSubmitHandler}>
          {/* Trường nhập email */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
              required
            />
            {/* Có thể thêm regex validate email */}
          </div>
          {/* Trường nhập mật khẩu */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Mật khẩu</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              required
            />
            {/* Có thể thêm toggle hiển thị/ẩn mật khẩu */}
          </div>
          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
