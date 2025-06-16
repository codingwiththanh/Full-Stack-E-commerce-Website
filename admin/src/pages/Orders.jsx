import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const statusTranslate = {
  "Order Placed": "Đã đặt hàng",
  "Packing": "Đang đóng gói",
  "Shipped": "Đã gửi hàng",
  "Out for delivery": "Đang giao hàng",
  "Delivered": "Đã giao hàng",
  "Cancelled": "Đã huỷ"
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editAddress, setEditAddress] = useState(null);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (orderId) => {
    if (!window.confirm("Xác nhận xoá đơn hàng này?")) return;

    try {
      const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } });
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

  const openEditForm = (order) => {
    setEditingOrderId(order._id);
    setEditAddress({ ...order.address });
  };

  const saveEditedAddress = async (orderId) => {
    try {
      const res = await axios.post(backendUrl + '/api/order/update-address', {
        orderId,
        newAddress: editAddress
      }, { headers: { token } });

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

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className='p-4 pr-[32px]'>
      <p className='mb-4 font-semibold text-2xl'>Tất cả đơn hàng</p>
      <div>
        {
          orders.map((order, index) => (
            <div className='relative grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1.3fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12 pt-[10px]' src={assets.parcel_icon} alt="" />
              <div>
                <p className="mt-2 text-[13px] font-semibold text-sky-500">Mã đơn hàng: {order.orderCode}</p>



                <div className='mt-[20px]'>
                  <div>
                    {order.items.map((item, idx) => (
                      <p className='py-0.5' key={idx}> {item.name} <br /> <span>Số lượng :</span> {item.quantity} <br /> <span>Kích cỡ: </span> <span> {item.size} </span> {idx < order.items.length - 1 ? ',' : ''}</p>
                    ))}
                  </div>
                  <p className=' font-medium'> <span>Người nhận: </span>{order.address.ho + " " + order.address.ten}</p>
                  <div>
                    <p><span>Đường:</span> {order.address.duongSonha}</p>
                    <p><span>Phường/Xã:</span> {order.address.phuongXa}</p>
                    <p><span>Quận/Huyện:</span> {order.address.quanHuyen}</p>
                    <p><span>Thành phố:</span> {order.address.thanhPho}</p>
                  </div>
                  <p><span>Điện thoại:</span> {order.address.dienThoai}</p>
                </div>

              </div>
              <div className='mt-2'>
                <p className='text-sm text-sky-500'>Sản phẩm: {order.items.length}</p>
                <div className='mt-[42px]'>
                  <p className='mt-3'>Phương thức: {order.paymentMethod}</p>
                  <p>
                    Thanh toán: <span className='text-red-600'>{
                      order.paymentMethod === 'COD'
                        ? 'Thanh toán khi nhận hàng'
                        : (order.payment ? 'Đã thanh toán' : 'Chưa thanh toán')
                    }</span>
                  </p>
                  <p>Ngày: {new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className='text-sm mt-2 text-center text-sky-500'><span>Hoá đơn :</span> {order.amount} {currency}</p>
              <div className="flex flex-col gap-3 ">
                <div>
                  {order.status !== "Đã huỷ" ? (
                    <select
                      onChange={(event) => statusHandler(event, order._id)}
                      value={order.status}
                      className="w-full p-2.5 text-sm font-semibold bg-gray-50 border border-gray-300  focus:border-sky-500 transition-colors text-sky-500"
                    >
                      <option className='text-black' value="Đã đặt hàng">Đã đặt hàng</option>
                      <option className='text-black' value="Chờ đóng gói">Chờ đóng gói</option>
                      <option className='text-black' value="Đã gửi hàng">Đã gửi hàng</option>
                      <option className='text-black' value="Đang giao hàng">Đang giao hàng</option>
                      <option className='text-black' value="Đã giao hàng">Đã giao hàng</option>
                    </select>
                  ) : (
                    <p className="text-red-600 font-semibold mt-[8px] mb-[8px] text-sm ">Đơn đã huỷ</p>
                  )}
                </div>
                <div className="flex gap-2 mt-[14px]" >
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    Xoá đơn
                  </button>
                  <button
                    onClick={() => openEditForm(order)}
                    className="flex-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200"
                  >
                    Sửa địa chỉ
                  </button>
                </div>
              </div>


              {editingOrderId === order._id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                  <div className="bg-white p-6 shadow-2xl  lg:w-[25%] ">
                    <h4 className="text-xl font-semibold text-center text-pink-600 mb-4">CẬP NHẬP ĐỊA CHỈ MỚI</h4>
                    <div className="grid gap-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Họ" value={editAddress.ho}
                          onChange={(e) => setEditAddress(prev => ({ ...prev, ho: e.target.value }))}
                          className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                        <input type="text" placeholder="Tên" value={editAddress.ten}
                          onChange={(e) => setEditAddress(prev => ({ ...prev, ten: e.target.value }))}
                          className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                      </div>
                      <input type="text" placeholder="Số điện thoại" value={editAddress.dienThoai}
                        onChange={(e) => setEditAddress(prev => ({ ...prev, dienThoai: e.target.value }))}
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                      <input type="text" placeholder="Đường" value={editAddress.duongSonha}
                        onChange={(e) => setEditAddress(prev => ({ ...prev, duongSonha: e.target.value }))}
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                      <input type="text" placeholder="Phường/Xã" value={editAddress.phuongXa}
                        onChange={(e) => setEditAddress(prev => ({ ...prev, phuongXa: e.target.value }))}
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                      <input type="text" placeholder="Quận/Huyện" value={editAddress.quanHuyen}
                        onChange={(e) => setEditAddress(prev => ({ ...prev, quanHuyen: e.target.value }))}
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                      <input type="text" placeholder="Thành phố" value={editAddress.thanhPho}
                        onChange={(e) => setEditAddress(prev => ({ ...prev, thanhPho: e.target.value }))}
                        className="border p-2 focus:outline-none focus:ring-1 focus:ring-pink-500" />
                    </div>
                    <div className="flex justify-end gap-4 mt-5">
                      <button onClick={() => setEditingOrderId(null)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition">
                        Huỷ
                      </button>
                      <button onClick={() => saveEditedAddress(order._id)}
                        className="bg-pink-600 text-white px-4 py-2 hover:bg-pink-700 transition">
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
