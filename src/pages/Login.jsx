import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Login = () => {
  const [currentState, setCurrentState] = useState('Đăng nhập');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const validateForm = () => {
    if (!email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ');
      return false;
    }
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (currentState === 'Đăng ký' && name.trim() === '') {
      toast.error('Vui lòng nhập tên');
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let response;
      if (currentState === 'Đăng ký') {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      }
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success(`${currentState} thành công!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col sm:flex-row justify-center items-center my-8 gap-8 flex-wrap shadow-2xl w-[90%] max-w-4xl bg-white ">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-full sm:w-[45%] gap-4 text-gray-800"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <p className="prata-regular text-2xl sm:text-3xl uppercase">{currentState}</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
          {currentState === 'Đăng ký' && (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Tên"
              required
            />
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Mật khẩu"
            required
          />
          <div className="w-full flex justify-between text-[18px] mt-1">
            <p className="cursor-pointer hover:text-neutral-900">Quên mật khẩu?</p>
            <p
              onClick={() => setCurrentState(currentState === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập')}
              className="cursor-pointer hover:text-neutral-900 "
            >
              {currentState === 'Đăng nhập' ? 'Tạo tài khoản' : 'Đăng nhập tại đây'}
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-stone-900 text-[#FF1461] uppercase font-medium px-8 py-2 mt-4 hover:bg-neutral-600 transition w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Đang xử lý...' : currentState === 'Đăng nhập' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
        <div className="w-[405px] h-[525px]">
          <img
            src={assets.contact3}
            alt="Hình minh họa đăng nhập"
            className="object-cover w-full h-full "
          />
        </div>
      </div>
    </div>
  );
};

export default Login;