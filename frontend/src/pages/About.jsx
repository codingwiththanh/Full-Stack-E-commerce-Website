import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'


const About = () => {
  return (
    <div>
      <div className=' flex flex-col md:flex-row  mt-[44px]'>
        <img className='w-full md:max-w-[500px]' src={assets.contact2} alt="" />
        <div className='flex flex-col  gap-4 ml-[44px] text-gray-600'>
          <Title text1={'ABOUT'} text2={'FREESTYLE'} className="text-4xl font-extrabold" />

          <p>Freestyle ra đời từ niềm đam mê đổi mới và mong muốn cách mạng hóa cách mọi người mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu với một ý tưởng đơn giản: cung cấp một nền tảng nơi khách hàng có thể dễ dàng khám phá, tìm hiểu và mua nhiều loại sản phẩm khác nhau ngay tại nhà.</p>
          <p>Kể từ khi thành lập, chúng tôi đã làm việc không biết mệt mỏi để tuyển chọn nhiều sản phẩm chất lượng cao đáp ứng mọi sở thích và nhu cầu. Từ thời trang và làm đẹp đến đồ điện tử và đồ gia dụng thiết yếu, chúng tôi cung cấp một bộ sưu tập phong phú có nguồn gốc từ các thương hiệu và nhà cung cấp đáng tin cậy.</p>
          <b className='text-gray-800'>Sứ mệnh của chúng tôi</b>
          <p>Sứ mệnh của chúng tôi tại Forever là trao quyền cho khách hàng với sự lựa chọn, tiện lợi và sự tự tin. Chúng tôi cam kết cung cấp trải nghiệm mua sắm liền mạch vượt quá mong đợi, từ việc duyệt và đặt hàng đến giao hàng và hơn thế nữa.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
