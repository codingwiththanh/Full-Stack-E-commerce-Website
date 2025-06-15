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
            <div className="flex items-center justify-between px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] bg-black">
                <div className="flex gap-4">
                    <NavLink
                        to="/about"
                        className="text-white flex flex-col items-center gap-1 px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                    >
                        <p className="w-full text-center text-sm">VỀ FREESTYLE</p>
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className="text-white flex flex-col items-center gap-1 px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                    >
                        <p className="w-full text-center text-sm">LIÊN HỆ</p>
                    </NavLink>
                </div>

                <p
                    onClick={() => (token ? null : navigate('/login'))}
                    className="text-sm text-white cursor-pointer px-2 py-2 hover:bg-[#404040] transition-colors duration-200"
                >
                    ĐĂNG NHẬP
                </p>
            </div>

            {/* Navbar menu */}
            <div className='flex items-center justify-between py-5 font-medium px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                {/* Logo */}
                <Link to='/'>
                    <p className='font-extrabold text-4xl' > FREESTYLE</p>
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
                        <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                        {/* Dropdown Menu */}
                        {token &&
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                                    <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>Tài khoản</p>
                                    <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Đơn hàng</p>
                                    <p onClick={logout} className='cursor-pointer hover:text-black'>Đăng xuất</p>
                                </div>
                            </div>}
                    </div>
                    <Link to='/cart' className='relative'>
                        <img src={assets.cart_icon} className='w-5 cursor-pointer' alt="" />
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
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
