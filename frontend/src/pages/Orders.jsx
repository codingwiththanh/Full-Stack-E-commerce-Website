import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency, delivery_fee } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, {
        headers: { token }
      });
      console.log("User orders:", response.data);

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) return;

    try {
      const res = await axios.put(`${backendUrl}/api/order/cancel/${orderId}`, {}, {
        headers: { token }
      });

      if (res.data.success) {
        alert("Huỷ đơn thành công!");
        loadOrderData();
      } else {
        alert(res.data.message || "Huỷ đơn thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi huỷ đơn hàng:", error);
      alert("Huỷ đơn thất bại");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='py-[40px]'>
      <div className='text-2xl'>
        <Title text1={'ĐƠN HÀNG'} text2={'CỦA BẠN'} />
      </div>

      <div>
        {orderData
          .filter(item => item.status !== "Đã huỷ")
          .map((item, index) => (
            <div key={index} className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt='' />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{item.price + delivery_fee } {currency}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Kích cỡ: {item.size}</p>
                  </div>
                  <p className='mt-1'>
                    Ngày: <span className='text-gray-400'>
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </p>

                  <p className='mt-1'>Phương thức: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>

              <div className='md:w-1/2 flex flex-col items-end gap-2'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={loadOrderData}
                    className='border px-4 py-2 text-sm font-medium '
                  >
                    Check trạng thái
                  </button>
                  {["Đã đặt hàng", "Chờ đóng gói"].includes(item.status) && (
                    <button
                      onClick={() => cancelOrder(item.orderId)}
                      className='border px-4 py-2 text-sm font-medium  text-red-600 border-red-600 hover:bg-red-50'
                    >
                      Huỷ đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;
