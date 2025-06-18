import axios from "axios";
import { backendUrl } from "../constants/config"; // ✅ Đường dẫn đúng

// Tạo instance riêng để dùng chung trong toàn bộ project
const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// Thêm interceptor để đính kèm token từ localStorage vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Có thể mở rộng thêm interceptor cho phản hồi (response) ở đây
// axiosInstance.interceptors.response.use(...)

export default axiosInstance;
