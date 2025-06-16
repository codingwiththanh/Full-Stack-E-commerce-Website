import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className=' flex flex-col md:flex-row  mt-[44px]'>
        <img className='w-full md:max-w-[500px]' src={assets.contact3} alt="" />
        <div className='flex flex-col  gap-4 ml-[44px] text-gray-600'>
          <Title text1={'LÊN'} text2={'HỆ'} className="text-4xl font-extrabold" />

          <p className='font-semibold text-xl text-gray-600'>Trụ sở chính</p>
          <p className=' text-gray-500'>VP Phía Bắc: Tầng 17 tòa nhà Viwaseen <br /> 48 Phố Tố Hữu, Trung Văn, Nam Từ Liêm, Hà Nội</p>
          <p className=' text-gray-500'>VP Phía Nam: 186A Nam Kỳ Khởi Nghĩa <br /> Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
          <p className=' text-gray-500'>Tel: 0888 886 688 <br /> Email: freestyle@foreveryou.com</p>
          <p className='font-semibold text-xl text-gray-600'>Công việc Freestyle</p>
          <p className=' text-gray-500'>Tìm hiểu thêm về các nhóm và việc làm của chúng tôi..</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>KHÁM PHÁ NGAY</button>

        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default Contact
