import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

// Component thêm sản phẩm
const Add = ({ token }) => {
  // Danh sách danh mục con tương ứng từng danh mục
  const subCategoryOptions = {
    Áo: ["Áo Thun", "Áo Polo", "Áo Sơ Mi"],
    Quần: ["Quần Nỉ", "Quần Âu", "Quần Short"],
    "Phụ kiện": ["Mũ", "Balo", "Túi Sách"],
  };

  // Các state dùng để lưu giá trị form
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Áo");
  const [subCategory, setSubCategory] = useState(subCategoryOptions["Áo"][0]);
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // Hàm xử lý khi gửi form
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!name.trim()) {
      toast.warn("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!description.trim()) {
      toast.warn("Vui lòng nhập mô tả sản phẩm");
      return;
    }
    if (!price.trim()) {
      toast.warn("Vui lòng nhập giá sản phẩm");
      return;
    }
    if (!image1) {
      toast.warn("Vui lòng tải lên ít nhất một ảnh sản phẩm");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // Thêm ảnh nếu có
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // Gửi dữ liệu lên server
      const response = await axiosInstance.post("/api/product/add", formData);
      if (response.data.success) {
        toast.success(response.data.message);

        // Reset form sau khi thêm thành công
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col max-w-2xl p-6">
      {/* Tải ảnh sản phẩm */}
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-3">Tải lên ảnh</p>
        <div className="flex gap-4">
          {[image1, image2, image3, image4].map((img, idx) => (
            <label
              key={idx}
              htmlFor={`image${idx + 1}`}
              className="relative w-24 h-24 border-2 border-gray-300 bg-gray-50 flex items-center justify-center transition-colors hover:border-blue-500 cursor-pointer"
            >
              <img
                className="w-full h-full object-cover"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt={`Upload ${idx + 1}`}
              />
              <input
                onChange={(e) => {
                  const setter = [setImage1, setImage2, setImage3, setImage4][
                    idx
                  ];
                  setter(e.target.files[0]);
                }}
                type="file"
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Nhập tên sản phẩm */}
      <div className="w-full">
        <p className="text-lg font-semibold text-gray-800 my-2">Tên sản phẩm</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
          type="text"
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      {/* Nhập mô tả */}
      <div className="w-full">
        <p className="text-lg font-semibold text-gray-800 my-2">Mô tả</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors h-32 resize-none"
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>

      {/* Chọn danh mục, danh mục con, giá */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Danh mục cha */}
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-3">Danh mục</p>
          <select
            value={category}
            onChange={(e) => {
              const selected = e.target.value;
              setCategory(selected);
              setSubCategory(subCategoryOptions[selected][0]);
            }}
            className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white"
          >
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
        </div>

        {/* Danh mục con */}
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-3">
            Danh mục con
          </p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white"
          >
            {subCategoryOptions[category]?.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Giá sản phẩm */}
        <div>
          <p className="text-lg font-semibold text-gray-800 mb-3">Giá</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-4 py-[9px] border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            type="number"
            placeholder="Nhập giá"
          />
        </div>
      </div>

      {/* Chọn kích cỡ */}
      <div>
        <p className="text-lg font-semibold text-gray-800 my-2">Chọn kích cỡ</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-2 border border-gray-300 text-gray-700 font-medium cursor-pointer transition-colors ${
                sizes.includes(size)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      {/* Chọn sản phẩm bán chạy */}
      <div className="flex items-center gap-3 my-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
          className="w-5 h-5 accent-blue-500"
        />
        <label
          htmlFor="bestseller"
          className="text-lg text-gray-800 cursor-pointer"
        >
          Thêm vào bán chạy
        </label>
      </div>

      {/* Nút gửi */}
      <button
        type="submit"
        className="w-40 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        THÊM MỚI
      </button>
    </form>
  );
};

export default Add;
