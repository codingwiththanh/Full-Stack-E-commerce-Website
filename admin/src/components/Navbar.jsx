import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center px-8 py-4 justify-between'>
      <p className='font-extrabold text-4xl'>FREESTYLE <span className='text-pink-400'>DASHBOARD</span></p>
      <button onClick={() => setToken('')} className='bg-pink-400 text-black px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Đăng xuất</button>
    </div>
  )
}

export default Navbar