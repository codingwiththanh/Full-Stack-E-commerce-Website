// Đoạn mã sau đã được format lại với comment bằng tiếng Việt nhằm tăng khả năng đọc hiểu
// và đánh dấu những vị trí có thể mở rộng thêm chức năng trong tương lai (VD: filter nâng cao, phân trang,...)

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDeleteLeft,
  faPenToSquare,
  faCircleCheck,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import SearchBar from "../components/Search";

const List = ({ token }) => {
  // Danh sách toàn bộ sản phẩm (data gốc)
  const [allProducts, setAllProducts] = useState([]);

  // Danh sách sản phẩm hiển thị sau khi lọc/tìm kiếm
  const [filteredList, setFilteredList] = useState([]);

  // Đang chỉnh sửa sản phẩm nào (ID)
  const [editingId, setEditingId] = useState(null);

  // Dữ liệu đang chỉnh sửa
  const [editData, setEditData] = useState({});

  // Dropdown chọn danh mục/loại
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  // Danh mục con tương ứng với từng danh mục
  const subCategoryOptions = {
    Áo: ["Áo Thun", "Áo Polo", "Áo Sơ Mi"],
    Quần: ["Quần Nỉ", "Quần Âu", "Quần Short"],
    "Phụ kiện": ["Mũ", "Balo", "Túi Sách"],
  };

  // Lấy danh sách sản phẩm từ API
  const fetchList = async () => {
    try {
      const response = await axiosInstance.get("/api/product/list");
      if (response.data.success) {
        const reversed = response.data.products.reverse();
        setAllProducts(reversed);
        setFilteredList(reversed);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Tìm kiếm sản phẩm theo tên hoặc mô tả
  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredList(allProducts);
      return;
    }

    const lower = keyword.toLowerCase();
    const filtered = allProducts.filter((item) => {
      return (
        item.name?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower)
      );
    });

    setFilteredList(filtered);
  };

  // Xoá sản phẩm sau khi xác nhận
  const removeProduct = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post("/api/product/remove", { id });
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // Tải lại ảnh sản phẩm trong lúc chỉnh sửa
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post("/api/product/upload", formData);
      if (res.data.success) {
        const imageUrl = res.data.imageUrl;
        const newImages = [...editData.image];
        newImages[index] = imageUrl;
        setEditData((prev) => ({ ...prev, image: newImages }));
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Tải ảnh thất bại");
    }
  };

  // Lưu chỉnh sửa sản phẩm
  const saveEdit = async (productId) => {
    try {
      const res = await axiosInstance.post("/api/product/update", {
        productId,
        updatedData: editData,
      });
      if (res.data.success) {
        toast.success("Cập nhật thành công");
        setEditingId(null);
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Lỗi cập nhật");
    }
  };

  // Chọn danh mục chính trong edit mode
  const handleCategorySelect = (category) => {
    const defaultSub = subCategoryOptions[category]?.[0] || "";
    setEditData((prev) => ({
      ...prev,
      category,
      subCategory: defaultSub,
    }));
    setShowCategoryDropdown(false);
  };

  // Chọn danh mục con trong edit mode
  const handleSubCategorySelect = (subCategory) => {
    setEditData((prev) => ({
      ...prev,
      subCategory,
    }));
    setShowSubCategoryDropdown(false);
  };

  useEffect(() => {
    fetchList(); // load data khi component mount
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-2xl font-bold text-neutral-800">TẤT CẢ SẢN PHẨM</p>

        {/* Có thể thêm chức năng lọc nâng cao ở đây */}
        <SearchBar onSearch={handleSearch} />
      </div>

      <table className="w-full border border-neutral-600 text-sm">
        <thead className="bg-[#FF1461] bg-opacity-20 text-white">
          <tr>
            <th className="p-2 text-neutral-900 border font-semibold w-[160px]">
              Hình ảnh
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[320px]">
              Tên sản phẩm
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[320px]">
              Mô tả
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[120px]">
              Danh mục
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[120px]">
              Danh mục con
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[105px]">
              Giá
            </th>
            <th className="p-2 text-neutral-900 border font-semibold w-[95px]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item, index) => (
            <tr
              key={index}
              className={`border-t ${
                index % 2 === 0 ? "bg-neutral-50" : "bg-white"
              }  transition-colors duration-200`}
            >
              <td className="py-2 w-[160px] h-[160px] border border-neutral-200 text-center ">
                <div className="flex flex-wrap gap-2 justify-center items-center ">
                  {editingId === item._id
                    ? editData.image?.map((img, i) => (
                        <div key={i} className="relative w-16 h-16">
                          <img
                            src={img || assets.upload_area}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleImageUpload(e, i)}
                          />
                        </div>
                      ))
                    : item.image?.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-16 h-16 object-cover"
                        />
                      ))}
                </div>
              </td>
              <td className="px-4 border w-[320px] h-[160px] border-neutral-200 whitespace-pre-line">
                {editingId === item._id ? (
                  <textarea
                    className="w-full h-[140px] outline-none p-2  text-sm resize-none"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  <p className="text-neutral-800">{item.name}</p>
                )}
              </td>
              <td className="px-4 border w-[320px] h-[160px] border-neutral-200 whitespace-pre-line">
                {editingId === item._id ? (
                  <textarea
                    className="w-full h-[140px] outline-none p-2  text-sm resize-none"
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-neutral-800">{item.description}</p>
                )}
              </td>
              <td className="p-4 border border-neutral-200 text-center relative">
                {editingId === item._id ? (
                  <div
                    onMouseEnter={() => setShowCategoryDropdown(true)}
                    onMouseLeave={() => setShowCategoryDropdown(false)}
                  >
                    <div className="w-[87px] border border-neutral-200 p-2 bg-neutral-50 text-sm cursor-pointer">
                      {editData.category || "Chọn danh mục"}
                    </div>
                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-[87px] bg-white border border-neutral-200 mt-1 text-sm">
                        {["Áo", "Quần", "Phụ kiện"].map((category, i) => (
                          <div
                            key={i}
                            className="p-2 hover:bg-neutral-100 cursor-pointer"
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-800">{item.category}</p>
                )}
              </td>
              <td className=" border px-2 border-neutral-200 text-center relative">
                {editingId === item._id ? (
                  <div
                    onMouseEnter={() => setShowSubCategoryDropdown(true)}
                    onMouseLeave={() => setShowSubCategoryDropdown(false)}
                  >
                    <div className="w-[104px]  border border-neutral-200 p-2 bg-gray-50 text-sm cursor-pointer">
                      {editData.subCategory || "Chọn danh mục con"}
                    </div>
                    {showSubCategoryDropdown && (
                      <div className="absolute z-10 w-[104px] bg-white border border-x-neutral-200 mt-1 text-sm">
                        {(subCategoryOptions[editData.category] || []).map(
                          (sub, i) => (
                            <div
                              key={i}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSubCategorySelect(sub)}
                            >
                              {sub}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-neutral-800">{item.subCategory}</p>
                )}
              </td>
              <td className=" border px-2 border-neutral-200 text-center">
                {editingId === item._id ? (
                  <input
                    type="number"
                    className="w-full border border-neutral-200 p-2 text-sm text-center"
                    value={editData.price || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-neutral-800 text-center">
                    {item.price} <span>VNĐ</span>
                  </p>
                )}
              </td>
              <td className=" border border-neutral-200 text-center">
                {editingId === item._id ? (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => saveEdit(item._id)}
                      className="text-green-500 hover:text-green-600 transform hover:scale-110 transition-transform duration-200"
                      title="Lưu thay đổi"
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-2xl"
                      />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-transform duration-200"
                      title="Hủy chỉnh sửa"
                    >
                      <FontAwesomeIcon icon={faBan} className="text-2xl" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setEditData(item);
                      }}
                      className="text-blue-500 hover:text-blue-600 transform hover:scale-110 transition-transform duration-200"
                      title="Chỉnh sửa"
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-2xl"
                      />
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="text-red-500 hover:text-red-600 transform hover:scale-110 transition-transform duration-200"
                      title="Xóa sản phẩm"
                    >
                      <FontAwesomeIcon
                        icon={faDeleteLeft}
                        className="text-2xl"
                      />
                    </button>
                  </div>
                )}
              </td>
            </tr>
            // Vùng hành động có thể mở rộng thêm "Ngừng bán", "Khôi phục", v.v.
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
