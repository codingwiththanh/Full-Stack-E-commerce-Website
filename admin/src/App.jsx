// src/App.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // State lưu token đăng nhập
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Cập nhật token vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hiển thị các thông báo toast */}
      <ToastContainer />

      {/* Nếu chưa có token thì hiện form đăng nhập */}
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          {/* Navbar và layout sau khi đăng nhập */}
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[84%] text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
