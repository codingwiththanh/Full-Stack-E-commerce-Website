import React, { useState } from "react";
import { assets } from "../assets/assets";

// Component thanh tìm kiếm
const SearchBar = ({ onSearch }) => {
  // State lưu giá trị tìm kiếm
  const [search, setSearch] = useState("");

  // Xử lý tìm kiếm khi nhấn Enter hoặc click icon
  const handleSearch = () => {
    onSearch(search.trim());
    // Có thể thêm lưu lịch sử tìm kiếm vào localStorage
  };

  // Xử lý sự kiện nhấn phím
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    // Có thể thêm phím Esc để xóa input
  };

  return (
    // Container thanh tìm kiếm
    <div className="text-center w-1/3 mr-2">
      <div className="inline-flex items-center w-full border border-gray-400 px-5 py-[10px] rounded-full">
        {/* Input tìm kiếm */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Bạn đang tìm gì..."
        />
        {/* Icon tìm kiếm */}
        <img
          className="w-4 cursor-pointer"
          src={assets.search_icpon}
          alt="search"
          onClick={handleSearch}
        />
      </div>
      {/* Có thể thêm danh sách gợi ý tìm kiếm */}
    </div>
  );
};

export default SearchBar;
