import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'VNĐ';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: backendUrl
    });

    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axiosInstance.interceptors.request.use(
            config => {
                if (token) {
                    config.headers.token = token;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Response Interceptor
        const responseInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    setToken('');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        if (!token) {
            toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        setCartItems(cartData);

        try {
            await axiosInstance.post('/api/cart/add', { itemId, size });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) => {
            return total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
        }, 0);
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        try {
            await axiosInstance.post('/api/cart/update', { itemId, size, quantity });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            for (const size in cartItems[itemId]) {
                totalAmount += (itemInfo?.price || 0) * cartItems[itemId][size];
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axiosInstance.get('/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (tokenParam) => {
        try {
            const response = await axiosInstance.post('/api/cart/get', {}, {
                headers: { token: tokenParam || token }
            });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (!token && savedToken) {
            setToken(savedToken);
            getUserCart(savedToken);
        } else if (token) {
            getUserCart();
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, axiosInstance
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider; 