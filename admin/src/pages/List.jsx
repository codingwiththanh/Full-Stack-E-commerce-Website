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

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const subCategoryOptions = {
    Áo: ["Áo Thun", "Áo Polo", "Áo Sơ Mi"],
    Quần: ["Quần Nỉ", "Quần Âu", "Quần Short"],
    "Phụ kiện": ["Mũ", "Balo", "Túi Sách"],
  };

  const fetchList = async () => {
    try {
      const response = await axiosInstance.get("/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
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
  };
  

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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-4 pr-[32px] overflow-x-auto">
      <p className="mb-4 font-semibold text-2xl">Tất cả sản phẩm</p>
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border w-[332px]">Image</th>
            <th className="p-2 border w-[332px]">Name</th>
            <th className="p-4 border w-[200px]">Description</th>
            <th className="p-2 border w-[120px]">Category</th>
            <th className="p-2 border w-[120px]">SubCategory</th>
            <th className="p-2 border w-[100px]">Price</th>
            <th className="p-2 border w-[80px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index} className="border-t h-[108px] align-middle">
              <td className="p-2 border text-center">
                <div className="grid grid-cols-4 gap-1 justify-center items-center">
                  {editingId === item._id
                    ? editData.image?.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 mx-auto">
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
                          className="w-16 h-16 object-cover mx-auto"
                        />
                      ))}
                </div>
              </td>
              <td className="p-2 border">
                {editingId === item._id ? (
                  <textarea
                    className="w-full border p-1 text-sm"
                    rows={2}
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  <p>{item.name}</p>
                )}
              </td>
              <td className="p-2 border">
                {editingId === item._id ? (
                  <textarea
                    rows={3}
                    className="w-full border p-1 text-sm"
                    value={editData.description || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === item._id ? (
                  <select
                    value={editData.category}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const defaultSub =
                        subCategoryOptions[selected]?.[0] || "";
                      setEditData((prev) => ({
                        ...prev,
                        category: selected,
                        subCategory: defaultSub,
                      }));
                    }}
                    className="w-[100px] border p-1 text-sm"
                  >
                    <option value="Áo">Áo</option>
                    <option value="Quần">Quần</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                ) : (
                  <p>{item.category}</p>
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === item._id ? (
                  <select
                    value={editData.subCategory}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        subCategory: e.target.value,
                      }))
                    }
                    className="w-[120px] border p-1 text-sm"
                  >
                    {(subCategoryOptions[editData.category] || []).map(
                      (sub, i) => (
                        <option key={i} value={sub}>
                          {sub}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p>{item.subCategory}</p>
                )}
              </td>
              <td className="p-2 border text-center">
                <input
                  type="number"
                  value={editingId === item._id ? editData.price : item.price}
                  disabled={editingId !== item._id}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full border-b text-center bg-transparent"
                />
              </td>
              <td className="p-2 border text-center">
                {editingId === item._id ? (
                  <div className="flex justify-center gap-2">
                    <FontAwesomeIcon
                      onClick={() => saveEdit(item._id)}
                      icon={faCircleCheck}
                      className="text-green-500 text-2xl cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => setEditingId(null)}
                      icon={faBan}
                      className="text-red-500 text-2xl cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center gap-2">
                    <FontAwesomeIcon
                      onClick={() => {
                        setEditingId(item._id);
                        setEditData(item);
                      }}
                      icon={faPenToSquare}
                      className="text-blue-500 text-2xl cursor-pointer"
                    />
                    <FontAwesomeIcon
                      onClick={() => removeProduct(item._id)}
                      icon={faDeleteLeft}
                      className="text-red-500 text-2xl cursor-pointer"
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
