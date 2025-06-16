import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-2xl pt-8 pb-2 text-center">
        <Title text1={'GIỎ HÀNG'} text2={'CỦA BẠN'} />
      </div>

      {/* Desktop: Table Layout, Mobile: Card Layout */}
      <div className="mt-4">
        {/* Desktop Table */}
        <table className="hidden sm:table w-full text-left text-gray-700 border">
          <colgroup>
            <col style={{ width: '60%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '5%' }} />
          </colgroup>
          <thead className="text-xl font-semibold text-neutral-900">
            <tr>
              <th className="pl-4 py-3">Sản phẩm</th>
              <th className="text-center py-3">Kích cỡ</th>
              <th className="text-center py-3">Số lượng</th>
              <th className="text-center py-3">Giá</th>
              <th className="text-center py-3">Xóa</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => {
              const productData = products.find(p => p._id === item._id);
              if (!productData) return null;
              return (
                <tr key={index} className="border-t">
                  <td className="flex items-center gap-4 py-4">
                    <img className="w-20 pl-4" src={productData.image[0]} alt={productData.name} />
                    <p className="text-lg font-medium">{productData.name}</p>
                  </td>
                  <td className="text-center">
                    <span className="px-3 py-1 border bg-slate-50 inline-block">{item.size}</span>
                  </td>
                  <td className="text-center">
                    <div className="border flex justify-between mx-auto w-24">
                      <button
                        onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                        className="w-8 py-1 border-r"
                        aria-label="Giảm số lượng"
                      >
                        -
                      </button>
                      <span className="w-8 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                        className="w-8 py-1 border-l"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {productData.price.toLocaleString('vi-VN')} {currency}
                  </td>
                  <td className="text-center">
                    <img
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="w-5 cursor-pointer m-auto"
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

        {/* Mobile Card Layout */}
        <div className="sm:hidden flex flex-col gap-4">
          {cartData.map((item, index) => {
            const productData = products.find(p => p._id === item._id);
            if (!productData) return null;
            return (
              <div key={index} className="border p-4-lg flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <img className="w-16 h-16 object-cover" src={productData.image[0]} alt={productData.name} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{productData.name}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Giá: </span>
                      {productData.price.toLocaleString('vi-VN')} {currency}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Kích cỡ: </span>
                      <span className="px-2 py-1 border bg-slate-50 inline-block">{item.size}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border">
                    <button
                      onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border-r text-lg"
                      aria-label="Giảm số lượng"
                    >
                      -
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border-l text-lg"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="w-5 cursor-pointer"
                    src={assets.bin_icon}
                    alt="Xóa sản phẩm"
                    aria-label="Xóa sản phẩm"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Total and Checkout */}
      <div className="my-8 flex justify-center sm:justify-end">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-center sm:text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-neutral-900 text-[#FF1461] text-sm w-full sm:w-auto px-8 py-3 mt-4 hover:bg-neutral-600"
              aria-label="Tiến hành thanh toán"
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;