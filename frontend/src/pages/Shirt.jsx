import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Shirt = () => {
    const { products } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let result = products.filter(item => item.category === 'Áo');
        if (subCategory.length > 0) {
            result = result.filter(item => subCategory.includes(item.subCategory));
        }
        setFiltered(result);
    };

    const sortProduct = () => {
        let copy = filtered.slice();
        switch (sortType) {
            case 'low-high':
                setFiltered(copy.sort((a, b) => a.price - b.price));
                break;
            case 'high-low':
                setFiltered(copy.sort((a, b) => b.price - a.price));
                break;
            default:
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        applyFilter();
    }, [products, subCategory]);

    useEffect(() => {
        sortProduct();
    }, [sortType]);

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt='' />
                </p>
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p
                            className={`cursor-pointer ${subCategory.includes('Áo Thun') ? 'text-sky-500 font-medium' : ''}`}
                            onClick={() => toggleSubCategory({ target: { value: 'Áo Thun' } })}
                        >
                            Áo Thun
                        </p>
                        <p
                            className={`cursor-pointer ${subCategory.includes('Áo Polo') ? 'text-sky-500 font-medium' : ''}`}
                            onClick={() => toggleSubCategory({ target: { value: 'Áo Polo' } })}
                        >
                            Áo Polo
                        </p>
                        <p
                            className={`cursor-pointer ${subCategory.includes('Áo Sơ Mi') ? 'text-sky-500 font-medium' : ''}`}
                            onClick={() => toggleSubCategory({ target: { value: 'Áo Sơ Mi' } })}
                        >
                            Áo Sơ Mi
                        </p>

                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className='border-2 border-gray-300 text-sm px-2'
                    >
                        <option value='relavent'>Sort by: Relavent</option>
                        <option value='low-high'>Sort by: Low to High</option>
                        <option value='high-low'>Sort by: High to Low</option>
                    </select>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6'>
                    {filtered.map((item, index) => (
                        <ProductItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shirt;