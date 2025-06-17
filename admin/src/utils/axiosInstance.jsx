import axios from "axios";
import { backendUrl } from "../constants/config"; // bạn đã sửa đúng đường dẫn

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// 👉 Thêm interceptor để đính kèm token nếu có
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

export default axiosInstance;
