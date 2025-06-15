import React from 'react'
import { assets } from '../assets/assets';

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='flex flex-col lg:flex-row my-[44px]'>
  <div>
    <img src={assets.newbox} alt="" className='w-[1920px] h-full object-cover' />
  </div>
  <div className='bg-[#232321] text-white px-6 py-12 shadow-lg flex flex-col justify-center items-center w-full'>
    <p className='text-2xl font-semibold mb-4 text-white text-center'>Đăng ký nhận mã giảm giá 20%</p>
    <p className='text-gray-400 text-center mb-6 px-4 w-3/4'>
      Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn
    </p>
    <form onSubmit={onSubmitHandler} className='w-full flex flex-col sm:flex-row items-center gap-3'>
      <input
        className='w-full px-4 py-3 text-black outline-none'
        type="email"
        placeholder='Nhập email của bạn'
        required
      />
      <button
        type='submit'
            className='bg-white text-black text-sm font-semibold w-full sm:w-auto py-[14px] hover:bg-[#a3a3a3] lg:w-[184px] lg:h-[48px]'
      >
        ĐĂNG KÝ
      </button>
    </form>
  </div>
</div>


  )
}

export default NewsletterBox
