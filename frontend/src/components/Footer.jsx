import React from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div >
      <hr />
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 my-10 text-sm px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

        <div>
          <Link to='/'>
            <p className='font-extrabold text-4xl' > FREESTYLE</p>
          </Link>
          <p className='w-full  text-gray-600 mt-4'>
            CÔNG TY CỔ PHẦN THỜI TRANG KOWIL VIỆT NAM <br />
            Hotline: 1900 8079 <br />
            8:30 - 19:00 tất cả các ngày trong tuần.
          </p>
          <p className='w-full md:w-5/6  text-gray-600 text-[12px] mt-8'>
            <b>VP Phía Bắc:</b> Tầng 17 tòa nhà Viwaseen, 48 Phố Tố Hữu, Trung Văn, Nam Từ Liêm, Hà Nội.
          </p>
          <p className='w-full md:w-5/6  text-gray-600 text-[12px]'>
            <b>VP Phía Nam:</b> 186A Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, TP.HCM
          </p>
        </div>

        <div>
          <p className='text-[16px] font-extrabold mb-5'>GIỚI THIỆU FREESTYLE</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className='mb-2'>Gới thiệu</li>
            <li className='mb-2'>Hệ thống cửa hàng</li>
            <li className='mb-2'>Liên hệ FREESTYLE</li>
            <li className='mb-2'>Chính sách bảo mật</li>
          </ul>
        </div>

        <div>
          <p className='text-[16px] font-extrabold mb-5'>HỖ TRỢ KHÁCH HÀNG</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className='mb-2'>Hỏi đáp</li>
            <li className='mb-2'>Chính sách vận chuyển</li>
            <li className='mb-2'>Hướng dẫn chọn kích cỡ</li>
            <li className='mb-2'>Hướng dẫn thanh toán</li>
            <li className='mb-2'>Quy định đổi hàng</li>
            <li className='mb-2'>Hướng dẫn mua hàng</li>
          </ul>
        </div>

        <div>
          <p className='text-[16px] font-extrabold mb-5'>KẾT NỐI</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <div className='flex gap-2 mb-4'>
              <img src={assets.facebook} alt="" className='w-8' />
              <img src={assets.instagram} alt="" className='w-8' />
              <img src={assets.tiktok} alt="" className='w-8' />
            </div>
            <li className='mb-4 text-[16px]'>freestyle@foreveryou.com</li>
            <img src={assets.logoSaleNoti} alt="" className='w-40'/>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-3 text-sm text-center'>@Developed by Nguyen Van Thanh.</p>
      </div>

    </div>
  )
}

export default Footer
