import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            tempData.push({
              _id: productId,
              size: size,
              quantity: cartItems[productId][size],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleCheckboxChange = (itemId, size) => {
    const key = `${itemId}-${size}`;
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }

    const selectedCartData = cartData.filter((item) =>
      selectedItems.includes(`${item._id}-${item.size}`)
    );

    navigate('/place-order', { state: { selectedCartData } });
  };

  return (
    <div className="px-4">
      <div className="text-2xl pt-8 pb-2 text-center">
        <Title text1={'GIỎ HÀNG'} text2={'CỦA BẠN'} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Giỏ hàng của bạn đang trống.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-neutral-900 text-white px-6 py-2 text-sm hover:bg-neutral-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <>
          {/* Desktop: Table Layout */}
          <table className="hidden sm:table w-full text-left text-gray-700 border">
            <colgroup>
              <col style={{ width: '5%' }} />
              <col style={{ width: '55%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead className="text-xl font-semibold text-neutral-900">
              <tr>
                <th className="text-center pl-4 py-3">Chọn</th>
                <th className="pl-4 py-3">Sản phẩm</th>
                <th className="text-center py-3">Kích cỡ</th>
                <th className="text-center py-3">Số lượng</th>
                <th className="text-center py-3">Giá</th>
                <th className="text-center py-3">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartData.map((item, index) => {
                const productData = products.find((p) => p._id === item._id);
                if (!productData) return null;
                const key = `${item._id}-${item.size}`;
                return (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-4 pl-6">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 border-gray-300 cursor-pointer"
                        checked={selectedItems.includes(key)}
                        onChange={() => handleCheckboxChange(item._id, item.size)}
                      />
                    </td>
                    <td className="flex items-center gap-4 py-4">
                      <img
                        className="w-20 pl-4 object-cover"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                      <p className="text-lg font-medium">{productData.name}</p>
                    </td>
                    <td className="text-center">
                      <span className="px-3 py-1 border bg-slate-50 inline-block">{item.size}</span>
                    </td>
                    <td className="text-center">
                      <div className="border flex justify-between mx-auto w-24">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))
                          }
                          className="w-8 py-1 border-r hover:bg-gray-200"
                          aria-label="Giảm số lượng"
                        >
                          -
                        </button>
                        <span className="w-8 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                          className="w-8 py-1 border-l hover:bg-gray-200"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {(productData.price * item.quantity).toLocaleString('vi-VN')} {currency}
                    </td>
                    <td className="text-center">
                      <img
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        className="w-5 cursor-pointer m-auto hover:opacity-70"
                        src={assets.bin_icon}
                        alt="Xóa sản phẩm"
                        aria-label="Xóa sản phẩm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile: Card Layout */}
          <div className="sm:hidden flex flex-col gap-4">
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;
              const key = `${item._id}-${item.size}`;
              return (
                <div key={index} className="border p-4 rounded-lg flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 border-gray-300 cursor-pointer"
                      checked={selectedItems.includes(key)}
                      onChange={() => handleCheckboxChange(item._id, item.size)}
                    />
                    <img
                      className="w-16 h-16 object-cover rounded"
                      src={productData.image[0]}
                      alt={productData.name}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{productData.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Giá: </span>
                        {(productData.price * item.quantity).toLocaleString('vi-VN')} {currency}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-semibold">Kích cỡ: </span>
                        <span className="px-2 py-1 border bg-slate-50 inline-block">{item.size}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center border-r text-lg hover:bg-gray-200"
                        aria-label="Giảm số lượng"
                      >
                        -
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border-l text-lg hover:bg-gray-200"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                    <img
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="w-5 cursor-pointer hover:opacity-70"
                      src={assets.bin_icon}
                      alt="Xóa sản phẩm"
                      aria-label="Xóa sản phẩm"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Total and Checkout */}
          <div className="my-8 flex justify-center sm:justify-end">
            <div className="w-full sm:w-[450px]">
              <CartTotal selectedItems={selectedItems} cartData={cartData} />
              <div className="w-full text-center sm:text-end">
                <button
                  onClick={handleCheckout}
                  className="bg-neutral-900 text-[#FF1461] text-sm w-full sm:w-auto px-8 py-3 mt-4 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedItems.length === 0}
                  aria-label="Tiến hành thanh toán"
                >
                  TIẾN HÀNH THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;