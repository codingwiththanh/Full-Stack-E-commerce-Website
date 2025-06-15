import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { category, productId } = useParams();
  const { products, currency ,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  return productData ? (
    <div className='pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-[142px]'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-[610px] h-[610px] object-cover'>
            <img src={image} alt="" />
          </div>
        </div>


        {/* -------- Product Info ---------- */}
        <div className='flex-3'>
          <h1 className='lg:w-[448px] font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{productData.price}{currency}</p>
          <p>Thông tin sản phẩm: </p>
          <p className='md:w-4/5 whitespace-pre-wrap break-words text-gray-800'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
        </div>
      </div>
      

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20 lg:w-[763px]'>
        <div>
          <div className='flex'>
            <b className='border w-1/2 text-center py-3 text-lg font-medium'>Mô tả </b>
            <p className='border w-1/2 text-center py-3 text-lg font-medium'>Đánh giá (122)</p>
          </div>
          <div className='flex flex-col px-2 my-6 text-sm text-gray-500'>
            <p>Thông tin sản phẩm: </p>
            <p className='md:w-4/5 whitespace-pre-wrap break-words text-gray-800'>{productData.description}</p>
          </div>
          <img src={productData.image[3]} alt="thumbnail" className='w-full' />
        </div>
        <div>
          <br />
          <p>Về FREESTYLE:</p>
          <p>You will never be younger than you are at this very moment “Enjoy Your Youth!”</p> <br />
          <p>Không chỉ là thời trang, FREESTYLE còn là “phòng thí nghiệm” của tuổi trẻ - nơi nghiên cứu và cho ra đời năng lượng mang tên “Youth”. Chúng mình luôn muốn tạo nên những trải nghiệm vui vẻ, năng động và trẻ trung. <br />
            Lấy cảm hứng từ giới trẻ, sáng tạo liên tục, bắt kịp xu hướng và phát triển đa dạng các dòng sản phẩm là cách mà chúng mình hoạt động để tạo nên phong cách sống hằng ngày của bạn. Mục tiêu của TEELAB là cung cấp các sản phẩm thời trang chất lượng cao với giá thành hợp lý. <br />
            Chẳng còn thời gian để loay hoay nữa đâu youngers ơi! Hãy nhanh chân bắt lấy những những khoảnh khắc tuyệt vời của tuổi trẻ.</p> <br /> 
          <p>FREESTYLE đã sẵn sàng trải nghiệm cùng bạn! “Enjoy Your Youth”, now!</p>
        </div>
        <div className='bg-[#F9F5F2] my-8'>
          <img className='lg:px-[160px]' src={assets.size} alt="" />
        </div>
        <p>
          Chính sách bảo hành: <br />
          - Miễn phí đổi hàng cho khách mua ở TEELAB trong trường hợp bị lỗi từ nhà sản xuất, giao nhầm hàng, bị hư hỏng trong quá trình vận chuyển hàng. <br />
          - Sản phẩm đổi trong thời gian 3 ngày kể từ ngày nhận hàng <br />
          - Sản phẩm còn mới nguyên tem, tags và mang theo hoá đơn mua hàng, sản phẩm chưa giặt và không dơ bẩn, hư hỏng bởi những tác nhân bên ngoài cửa hàng sau khi mua hàng.
        </p>
      </div>
  
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
