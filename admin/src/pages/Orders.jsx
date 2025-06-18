import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import axiosInstance from "../utils/axiosInstance";
import { currency } from "../constants/config";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import SearchBar from "../components/Search";

// Component quản lý danh sách đơn hàng
const Orders = ({ token }) => {
  // Danh sách tất cả đơn hàng
  const [allOrders, setAllOrders] = useState([]);

  // Danh sách đơn hàng đã lọc (sau khi tìm kiếm)
  const [filteredOrders, setFilteredOrders] = useState([]);

  // ID đơn hàng đang chỉnh sửa
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Dữ liệu địa chỉ đang chỉnh sửa
  const [editAddress, setEditAddress] = useState(null);

  // Hàm lấy danh sách đơn hàng từ server
  const fetchAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/order/all");
      if (response.data.success) {
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAllOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Tìm kiếm đơn hàng theo tên người nhận hoặc mã đơn
  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredOrders(allOrders);
      return;
    }

    const lower = keyword.toLowerCase();
    const filtered = allOrders.filter((order) => {
      const fullName = `${order.address.ho} ${order.address.ten}`.toLowerCase();
      const code = order.orderCode?.toLowerCase() || "";
      return fullName.includes(lower) || code.includes(lower);
    });

    setFilteredOrders(filtered);
  };

  // Xử lý cập nhật trạng thái đơn hàng
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axiosInstance.put("/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Xử lý xoá đơn hàng
  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Xác nhận xoá đơn hàng",
      text: "Bạn có chắc chắn muốn xoá đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete("/api/order/delete", {
        data: { orderId },
      });
      if (response.data.success) {
        toast.success("Đã xoá đơn hàng");
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Xoá thất bại");
    }
  };

  // Mở form sửa địa chỉ đơn hàng
  const openEditForm = (order) => {
    setEditingOrderId(order._id);
    setEditAddress({ ...order.address });
  };

  // Lưu địa chỉ sau khi chỉnh sửa
  const saveEditedAddress = async (orderId) => {
    const requiredFields = [
      { key: "ho", label: "Họ" },
      { key: "ten", label: "Tên" },
      { key: "dienThoai", label: "Số điện thoại" },
      { key: "duongSonha", label: "Đường" },
      { key: "phuongXa", label: "Phường/Xã" },
      { key: "quanHuyen", label: "Quận/Huyện" },
      { key: "thanhPho", label: "Thành phố" },
    ];

    for (const field of requiredFields) {
      if (!editAddress[field.key]?.trim()) {
        toast.warn(`Vui lòng nhập ${field.label}`);
        return;
      }
    }

    try {
      const res = await axiosInstance.put("/api/order/address", {
        orderId,
        newAddress: editAddress,
      });

      if (res.data.success) {
        toast.success("Đã cập nhật địa chỉ");
        setEditingOrderId(null);
        fetchAllOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Lỗi cập nhật địa chỉ");
    }
  };

  // Gọi API khi token thay đổi
  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="p-6 overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className=" text-2xl font-bold text-neutral-800">TẤT CẢ ĐƠN HÀNG</p>

        {/* Có thể mở rộng thêm lọc theo trạng thái hoặc phương thức thanh toán */}
        <SearchBar onSearch={handleSearch} />
      </div>

      <div>
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="relative grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1.3fr_1fr] gap-3 items-start border-2 border-[#e7a9be] p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-neutral-900"
          >
            {/* Icon */}
            <img className="w-12 pt-[10px]" src={assets.parcel_icon} alt="" />

            {/* Chi tiết đơn hàng */}
            <div>
              <p className="mt-2 text-[16px] font-semibold text-sky-600">
                Mã đơn hàng: {order.orderCode}
              </p>
              <div className="mt-[20px]">
                <div>
                  {order.items.map((item, idx) => (
                    <p className="py-0.5" key={idx}>
                      {item.name} <br />
                      <span>Số lượng :</span> {item.quantity} <br />
                      <span>Kích cỡ:</span> {item.size}
                      {idx < order.items.length - 1 ? "," : ""}
                    </p>
                  ))}
                </div>
                <p className="font-medium">
                  <span>Người nhận: </span>
                  {order.address.ho + " " + order.address.ten}
                </p>
                <div>
                  <p>
                    <span>Đường:</span> {order.address.duongSonha}
                  </p>
                  <p>
                    <span>Phường/Xã:</span> {order.address.phuongXa}
                  </p>
                  <p>
                    <span>Quận/Huyện:</span> {order.address.quanHuyen}
                  </p>
                  <p>
                    <span>Thành phố:</span> {order.address.thanhPho}
                  </p>
                </div>
                <p>
                  <span>Điện thoại:</span> {order.address.dienThoai}
                </p>
              </div>
            </div>

            {/* Thông tin thêm */}
            <div className="mt-2">
              <p className="text-[16px] font-semibold text-sky-600">
                Sản phẩm: {order.items.length}
              </p>
              <div className="mt-[22px]">
                <p className="mt-3">Phương thức: {order.paymentMethod}</p>
                <p>
                  Thanh toán:{" "}
                  <span className="text-red-600">
                    {order.paymentMethod?.toLowerCase() === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.payment
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </p>
                <p>Ngày: {new Date(order.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Tổng tiền */}
            <p className="text-[16px] font-semibold mt-2 text-center text-sky-600">
              <span>Hoá đơn :</span> {order.amount.toLocaleString("vi-VN")}{" "}
              {currency}
            </p>

            {/* Hành động */}
            <div className="flex flex-col gap-3">
              <div>
                {order.status !== "Đã huỷ" ? (
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="w-full p-2.5 text-[16px] font-semibold bg-gray-50 border border-gray-300 focus:border-sky-500 transition-colors text-sky-500"
                  >
                    <option className="text-black" value="Đã đặt hàng">
                      Đã đặt hàng
                    </option>
                    <option className="text-black" value="Chờ đóng gói">
                      Chờ đóng gói
                    </option>
                    <option className="text-black" value="Đã gửi hàng">
                      Đã gửi hàng
                    </option>
                    <option className="text-black" value="Đang giao hàng">
                      Đang giao hàng
                    </option>
                    <option className="text-black" value="Đã giao hàng">
                      Đã giao hàng
                    </option>
                  </select>
                ) : (
                  <p className="text-red-600 font-semibold mt-[8px] mb-[8px] text-[16px]">
                    Đơn đã huỷ
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-[14px]">
                <button
                  onClick={() => handleDelete(order._id)}
                  className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                >
                  Xoá đơn
                </button>
                {order.status !== "Đã huỷ" && (
                  <button
                    onClick={() => openEditForm(order)}
                    className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
                  >
                    Sửa địa chỉ
                  </button>
                )}
              </div>
            </div>

            {/* Form chỉnh sửa địa chỉ */}
            {editingOrderId === order._id && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                <div className="bg-white p-6 shadow-2xl lg:w-[25%]">
                  <h4 className="text-xl font-semibold text-center text-pink-600 mb-4">
                    CẬP NHẬT ĐỊA CHỈ MỚI
                  </h4>
                  <div className="grid gap-3 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Họ"
                        value={editAddress.ho}
                        onChange={(e) =>
                          setEditAddress((prev) => ({
                            ...prev,
                            ho: e.target.value,
                          }))
                        }
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="Tên"
                        value={editAddress.ten}
                        onChange={(e) =>
                          setEditAddress((prev) => ({
                            ...prev,
                            ten: e.target.value,
                          }))
                        }
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Số điện thoại"
                      value={editAddress.dienThoai}
                      onChange={(e) =>
                        setEditAddress((prev) => ({
                          ...prev,
                          dienThoai: e.target.value,
                        }))
                      }
                      className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Đường"
                      value={editAddress.duongSonha}
                      onChange={(e) =>
                        setEditAddress((prev) => ({
                          ...prev,
                          duongSonha: e.target.value,
                        }))
                      }
                      className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Phường/Xã"
                      value={editAddress.phuongXa}
                      onChange={(e) =>
                        setEditAddress((prev) => ({
                          ...prev,
                          phuongXa: e.target.value,
                        }))
                      }
                      className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Quận/Huyện"
                      value={editAddress.quanHuyen}
                      onChange={(e) =>
                        setEditAddress((prev) => ({
                          ...prev,
                          quanHuyen: e.target.value,
                        }))
                      }
                      className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="Thành phố"
                      value={editAddress.thanhPho}
                      onChange={(e) =>
                        setEditAddress((prev) => ({
                          ...prev,
                          thanhPho: e.target.value,
                        }))
                      }
                      className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-5">
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition"
                    >
                      Huỷ
                    </button>
                    <button
                      onClick={() => saveEditedAddress(order._id)}
                      className="bg-pink-600 text-white px-4 py-2 hover:bg-pink-700 transition"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
