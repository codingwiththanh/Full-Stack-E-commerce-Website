import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({ selectedItems, cartData }) => {
  const { currency, delivery_fee, getSelectedCartAmount } = useContext(ShopContext);

  const totalAmount = getSelectedCartAmount(selectedItems);
  const finalAmount = totalAmount === 0 ? 0 : totalAmount + delivery_fee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={'TỔNG'} text2={'TIỀN'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Số tiền</p>
          <p>
            {totalAmount.toLocaleString('vi-VN')} {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>
            {totalAmount === 0 ? 0 : delivery_fee.toLocaleString('vi-VN')} {currency}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Thanh toán</b>
          <b>
            {finalAmount.toLocaleString('vi-VN')} {currency}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal; 