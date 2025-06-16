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
      className='text-gray-700 cursor-pointer mb-8'
      to={`/${slug}/sanpham/${id}`}
    >
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{price}{currency}</p>
    </Link>
  );
};

export default ProductItem; 
