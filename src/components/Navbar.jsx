import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false);

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    return (
        <div className='border-b'>
            {/* Navbar top */}
            <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-neutral-800">
                <div className="flex">
                    <NavLink
                        to="/about"
                        className="text-[#FF1461] flex flex-col items-center gap-1 px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                    >
                        <p className="w-full text-center text-sm">VỀ FREESTYLE</p>
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="text-[#FF1461] flex flex-col items-center gap-1 px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                    >
                        <p className="w-full text-center text-sm">LIÊN HỆ</p>
                    </NavLink>
                </div>

                <p
                    onClick={() => (token ? null : navigate('/login'))}
                    className="text-sm text-[#FF1461] cursor-pointer px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                >
                    ĐĂNG NHẬP
                </p>
            </div>

            {/* Navbar menu */}
            <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                {/* Logo */}
                <Link to='/'>
                    <p className='font-extrabold text-4xl text-[#FF1461]' > FREESTYLE</p>
                </Link>
                {/* Menu */}
                <ul className='hidden sm:flex gap-5 text-sm text-black font-semibold'>
                    <NavLink to='/' className='flex flex-col items-center gap-1'>
                        <p>TRANG CHỦ</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
                    </NavLink>
                    <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                        <p>BỘ SƯU TẬP</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
                    </NavLink>
                    <NavLink to='/ao' className='flex flex-col items-center gap-1'>
                        <p>ÁO</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
                    </NavLink>
                    <NavLink to='/quan' className='flex flex-col items-center gap-1'>
                        <p>QUẦN</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
                    </NavLink>
                    <NavLink to='/phukien' className='flex flex-col items-center gap-1'>
                        <p>PHỤ KIỆN</p>
                        <hr className='w-2/4 border-none h-[1.5px] bg-black hidden' />
                    </NavLink>
                </ul>
                {/* icon */}
                <div className='flex items-center gap-6'>
                    <img onClick={() => { setShowSearch(true); navigate('/collection') }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />

                    <div className='group relative'>
                        <div className="relative group">
                            <img className="w-5 cursor-pointer" src={assets.profile_icon} alt="" />
                            <span
                                className={`
                                absolute bottom-[-3px] right-[-3px] w-2 h-2 rounded-full
                                ${token ? 'bg-green-500' : 'bg-yellow-400'}
                                `}
                            ></span>

                            {!token && (
                                <div className='absolute top-[120%] left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block z-50'>
                                    Bạn cần đăng nhập trước
                                </div>
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        {token &&
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                                <div className='flex flex-col gap-2 w-36 py-3 bg-[#404040] text-white'>
                                    <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-[#FF1461] m-auto'>Tài khoản</p>
                                    <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-[#FF1461] m-auto'>Đơn hàng</p>
                                    <p onClick={logout} className='cursor-pointer hover:text-[#FF1461] m-auto'>Đăng xuất</p>
                                </div>
                            </div>}
                    </div>
                    <Link to='/cart' className='relative'>
                        <img src={assets.cart_icon} className='w-5 cursor-pointer' alt="" />
                        <p className='absolute right-[-5px] bottom-[-5px] w-[17px] text-center leading-[17px] bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                    </Link>
                    <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
                </div>

                {/* Sidebar menu for small screens */}
                <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                    <div className='flex flex-col text-gray-600'>
                        <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                            <p>Back</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>TRANG CHỦ</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>BỘ SƯU TẬP</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/ao'>ÁO</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/quam'>QUẦN</NavLink>
                        <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/phukien'>PHỤ KIỆN</NavLink>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Navbar
