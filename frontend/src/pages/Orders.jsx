import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency, axiosInstance, navigate } =
    useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrderData = async () => {
    setIsLoading(true);
    try {
      if (!token) return;

      const response = await axiosInstance.post(
        "/api/order/userorders",
        {},
        {
          headers: {
            token: token, // ✅ THÊM token rõ ràng vào headers
          },
        }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id;
            item.orderCode = order.orderCode;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        toast.error(
          response.data.message || "Không thể tải danh sách đơn hàng"
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      toast.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) return;

    try {
      const response = await axiosInstance.put(
        `/api/order/cancel/${orderId}`,
        {}
      );
      if (response.data.success) {
        toast.success("Huỷ đơn thành công!");
        loadOrderData();
      } else {
        toast.error(response.data.message || "Huỷ đơn thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi huỷ đơn hàng:", error);
      toast.error("Huỷ đơn thất bại");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.warning("Vui lòng đăng nhập để xem đơn hàng!");
      navigate("/login");
    } else {
      loadOrderData();
    }
  }, [token, navigate]);

  return (
    <div className="py-10 px-4">
      <div className="text-2xl text-center">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA BẠN"} />
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải đơn hàng...</div>
      ) : orderData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Bạn chưa có đơn hàng nào.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-neutral-900 text-white px-6 py-2 text-sm hover:bg-neutral-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orderData
            .filter((item) => item.status !== "Đã huỷ")
            .map((item, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-start gap-4 text-sm">
                  <img
                    className="w-16 h-16 object-cover rounded"
                    src={item.image[0]}
                    alt={item.name}
                  />
                  <div>
                    <p className="sm:text-base font-medium">{item.name}</p>
                    <div className="flex flex-col gap-1 mt-1 text-gray-600">
                      <p>
                        Giá:{" "}
                        {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                        {currency}
                      </p>
                      <p>Số lượng: {item.quantity}</p>
                      <p>Kích cỡ: {item.size}</p>
                      <p>
                        Ngày đặt:{" "}
                        <span className="text-gray-400">
                          {new Date(item.date).toLocaleDateString("vi-VN")}
                        </span>
                      </p>
                      <p>
                        Mã đơn hàng:{" "}
                        <span className="text-gray-400">{item.orderCode}</span>
                      </p>
                      <p>
                        Phương thức:{" "}
                        <span className="text-gray-400">
                          {item.paymentMethod}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/3 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.status === "Đã giao hàng"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <p className="text-sm md:text-base">{item.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={loadOrderData}
                      className="border px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200"
                    >
                      Cập nhật trạng thái
                    </button>
                    {["Đã đặt hàng", "Chờ đóng gói"].includes(item.status) && (
                      <button
                        onClick={() => cancelOrder(item.orderId)}
                        className="border px-4 py-2 text-sm font-medium text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Huỷ đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
