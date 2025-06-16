import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export const slugifyCategory = (category) => {
  switch (category) {
    case 'Áo': return 'ao';
    case 'Quần': return 'quan';
    case 'Phụ kiện': return 'phukien';
    default: return 'unknown';
  }
};

const ProductItem = ({ id, image, name, price, category }) => {
  const { currency } = useContext(ShopContext);
  const slug = slugifyCategory(category);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer mb-8 mx-auto text-center"
      to={`/${slug}/sanpham/${id}`}
    >
      <div className="overflow-hidden bg-white">
        <img
          className="w-full h-full object-cover hover:scale-110 transition-transform ease-in-out duration-300"
          src={image[0]}
          alt={name}
        />
      </div>

      <div className="mt-4 px-1">
        <p className="text-[16px] leading-tight break-words line-clamp-2 h-[40px]">
          {name}
        </p>
        <p className="text-[18px] font-semibold text-gray-800 mt-1">
          {Number(price).toLocaleString('vi-VN')}<span className="ml-1">{currency}</span>
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
