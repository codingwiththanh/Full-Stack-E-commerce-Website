import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        ten: '',
        ho: '',
        email: '',
        duongSonha: '',
        phuongXa: '',
        quanHuyen: '',
        thanhPho: '',
        dienThoai: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }


            switch (method) {

                // API Calls for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
                    console.log("Order response:", response.data);

                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                default:
                    break;
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-[40px] sm:pt-[40px] min-h-[80vh]'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl '>
                    <Title text1={'THÔNG TIN'} text2={'VẬN CHUYỂN'} />
                </div>
                <div className='flex gap-3 mt-4'>
                    <input required onChange={onChangeHandler} name='ho' value={formData.ho} className='border border-gray-300  py-1.5 px-3.5 w-full' type="text" placeholder='Họ' />
                    <input required onChange={onChangeHandler} name='ten' value={formData.ten} className='border border-gray-300  py-1.5 px-3.5 w-full' type="text" placeholder='Tên' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 py-1.5 px-3.5 w-full' type="email" placeholder='Địa chỉ email' />
                <input
                    required
                    onChange={onChangeHandler}
                    name='dienThoai'
                    value={formData.dienThoai}
                    className='border border-gray-300 py-1.5 px-3.5 w-full'
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder='Điện thoại'
                />
                <input required onChange={onChangeHandler} name='duongSonha' value={formData.duongSonha} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Đường' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='phuongXa' value={formData.phuongXa} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Phường' />
                    <input onChange={onChangeHandler} name='quanHuyen' value={formData.quanHuyen} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Quận' />
                    <input onChange={onChangeHandler} name='thanhPho' value={formData.thanhPho} className='border border-gray-300 py-1.5 px-3.5 w-full' type="text" placeholder='Thành phố' />
                </div>


            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8  w-full sm:max-w-[480px]'>
                <div className='mt-10'>
                    <CartTotal />
                </div>

                <div className='mt-8'>
                    <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />

                    {/* --------------- Payment Method Selection ------------- */}
                    <div className='flex gap-2 flex-col lg:flex-row'>
                        {/* Napas */}
                        <div
                            className={`h-[48px] border border-gray-300 lg:w-1/2 cursor-pointer transition duration-200 flex items-center justify-center ${method === 'napas' ? 'border-black ring-2 ring-black' : ''
                                }`}
                            onClick={() => setMethod('napas')}
                        >
                            <img className='h-[32px]' src={assets.sepay} alt="Napas" />
                        </div>

                        {/* COD */}
                        <div
                            className={`h-[48px] border border-gray-300 lg:w-1/2 cursor-pointer transition duration-200 flex items-center justify-center ${method === 'cod' ? 'border-black ring-2 ring-black' : ''
                                }`}
                            onClick={() => setMethod('cod')}
                        >
                            <p className='text-gray-500 text-sm font-medium'>THANH TOÁN KHI GIAO HÀNG</p>
                        </div>
                    </div>

                    <button type='submit' className='mt-8 w-full h-[48px] bg-black text-white px-16 py-3 text-sm'>
                        TIẾN HÀNH THANH TOÁN
                    </button>

                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
