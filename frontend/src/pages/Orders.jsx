import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency, axiosInstance, navigate, delivery_fee } =
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
          headers: { token },
        }
      );

      if (response.data.success) {
        let allItems = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id;
            item.orderCode = order.orderCode;
            allItems.push(item);
          });
        });
        setOrderData(allItems.reverse());
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

  // Gom sản phẩm theo orderId
  const groupedOrders = {};
  orderData
    .filter((item) => item.status !== "Đã huỷ")
    .forEach((item) => {
      const orderId = item.orderId;
      if (!groupedOrders[orderId]) {
        groupedOrders[orderId] = {
          orderInfo: {
            status: item.status,
            payment: item.payment,
            paymentMethod: item.paymentMethod,
            date: item.date,
            orderId: item.orderId,
            orderCode: item.orderCode,
          },
          items: [],
        };
      }
      groupedOrders[orderId].items.push(item);
    });

  return (
    <div className="py-10 px-4">
      <div className="text-2xl text-center">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA BẠN"} />
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải đơn hàng...</div>
      ) : Object.keys(groupedOrders).length === 0 ? (
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
        <div className="mt-6 space-y-6">
          {Object.values(groupedOrders)
            .sort((a, b) => b.orderInfo.date - a.orderInfo.date)
            .map((order, index) => {
              const totalAmount = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const finalAmount = totalAmount + delivery_fee;

              return (
                <div key={index} className="p-4 border rounded bg-white shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        Mã đơn: {order.orderInfo.orderCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        Ngày đặt:{" "}
                        {new Date(order.orderInfo.date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phương thức: {order.orderInfo.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        Trạng thái: {order.orderInfo.status}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            order.orderInfo.status === "Đã giao hàng"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        <p className="text-sm md:text-base">
                          {order.orderInfo.status}
                        </p>
                      </div>
                      {["Đã đặt hàng", "Chờ đóng gói"].includes(
                        order.orderInfo.status
                      ) && (
                        <button
                          onClick={() => cancelOrder(order.orderInfo.orderId)}
                          className="border px-4 py-2 text-sm font-medium text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Huỷ đơn
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 border-t pt-4 text-sm text-gray-700"
                      >
                        <img
                          className="w-16 h-16 object-cover rounded"
                          src={item.image[0]}
                          alt={item.name}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p>
                            Giá:{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            {currency}
                          </p>
                          <p>Số lượng: {item.quantity}</p>
                          <p>Kích cỡ: {item.size}</p>
                        </div>
                      </div>
                    ))}

                    {/* ✅ Tổng tiền ở đây */}
                    <div className="pt-4 border-t text-right text-sm text-gray-800">
                      <p>
                        Tổng tiền hàng: {totalAmount.toLocaleString("vi-VN")}{" "}
                        {currency}
                      </p>
                      <p>
                        Phí vận chuyển: {delivery_fee.toLocaleString("vi-VN")}{" "}
                        {currency}
                      </p>
                      <p className="font-semibold text-base text-black">
                        Tổng cộng: {finalAmount.toLocaleString("vi-VN")}{" "}
                        {currency}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Orders;
