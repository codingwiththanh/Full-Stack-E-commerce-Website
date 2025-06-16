import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import ProductItem from '../components/ProductItem';

const Pants = () => {
    const { products } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filtered, setFiltered] = useState([]);
    const [subCategory, setSubCategory] = useState('');
    const [sortType, setSortType] = useState('relavent');

    const sortOptions = [
        { value: 'low-high', label: 'Thấp đến Cao' },
        { value: 'high-low', label: 'Cao đến Thấp' }
    ];

    const toggleSubCategory = (e) => {
        const selected = e.target.value;
        setSubCategory(prev => (prev === selected ? '' : selected));
    };

    const normalize = (str) => {
        return str
            ?.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    };


    const applyFilter = () => {
        let result = products.filter(item => normalize(item.category) === 'quan');
        if (subCategory) {
            result = result.filter(item => normalize(item.subCategory) === normalize(subCategory));
        }
        setFiltered(result);
    };

    const sortProduct = () => {
        let copy = [...filtered];
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
        <div className="flex flex-col sm:flex-row gap-4 pt-10">
            <div className="w-[205px]">
                <div className="text-lg relative group">
                    <div className="border-2 border-gray-300 text-sm pl-4 pr-8 py-2 w-full cursor-pointer flex justify-between items-center bg-white hover:border-[#FF1461] transition-colors">
                        <span>Sắp xếp giá</span>
                        <img src={assets.dropdown_icon} alt="dropdown icon" className={`h-3 sm:hidden transition-transform duration-200`} />
                    </div>
                    <ul className="absolute top-full left-0 w-full bg-white border-2 border-gray-300 mt-1 z-10 shadow-lg opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-200 overflow-hidden">
                        {sortOptions.map(option => (
                            <li key={option.value} onClick={() => setSortType(option.value)} className="px-4 py-2 text-sm hover:bg-neutral-100 hover:text-[#FF1461] cursor-pointer transition-colors duration-200">
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <p onClick={() => setShowFilter(!showFilter)} className="text-lg flex items-center cursor-pointer gap-2 font-semibold py-2 pl-2 hover:text-[#FF1461] transition-colors duration-200">
                    Danh mục
                    <img src={assets.dropdown_icon} alt="dropdown icon" className={`h-3 sm:hidden transition-transform duration-200 ${showFilter ? 'rotate-90' : ''}`} />
                </p>

                <div className={`${showFilter ? 'block' : 'hidden'} sm:block`}>
                    <div className="flex flex-col gap-1 text-[15px] font-light text-gray-700">
                        {['Quần Nỉ', 'Quần Âu', 'Quần Short'].map(item => (
                            <p
                                key={item}
                                className={`cursor-pointer px-3 py-[6px] transition-all duration-200 ease-in-out ${subCategory === item ? 'bg-[#fff0f4] text-[#FF1461] font-medium shadow-inner' : 'hover:bg-neutral-100 hover:text-[#FF1461]'}`}
                                onClick={() => toggleSubCategory({ target: { value: item } })}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
                    {filtered.map((item, index) => (
                        <ProductItem key={index} id={item._id} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pants;