import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

// Component thanh Sidebar bên trái
const Sidebar = () => {
  return (
    <div className="w-[16%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[32px] text-[15px]">
        {/* Liên kết đến trang thêm sản phẩm */}
        {/* Có thể mở rộng để thêm phân quyền hiển thị tùy theo vai trò người dùng */}
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive ? "bg-[#FF1461] text-white" : ""
            }`
          }
        >
          <img className="w-5 h-5" src={assets.add_icon} alt="" />
          <p className="hidden md:block">THÊM SẢN PHẨM</p>
        </NavLink>

        {/* Liên kết đến danh sách sản phẩm */}
        {/* Có thể thêm filter theo loại sản phẩm trong tương lai */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive ? "bg-[#FF1461] text-white" : ""
            }`
          }
          to="/list"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">SẢN PHẨM</p>
        </NavLink>

        {/* Liên kết đến danh sách đơn hàng */}
        {/* Có thể thêm bộ lọc đơn hàng theo trạng thái hoặc ngày tháng */}
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-colors duration-200 ${
              isActive ? "bg-[#FF1461] text-white" : ""
            }`
          }
          to="/orders"
        >
          <img className="w-5 h-5" src={assets.order_icon} alt="" />
          <p className="hidden md:block">ĐƠN HÀNG</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
