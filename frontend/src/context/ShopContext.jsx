import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "VNĐ";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: backendUrl,
    });

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.token = token;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    setToken("");
                    setCartItems({});
                    localStorage.removeItem("token");
                    navigate("/login");
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
            toast.error("Vui lòng chọn kích cỡ");
            return;
        }

        if (!token) {
            toast.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate("/login");
            return;
        }

        const updatedCart = structuredClone(cartItems);
        if (!updatedCart[itemId]) updatedCart[itemId] = {};
        updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
        setCartItems(updatedCart);

        try {
            await axiosInstance.post("/api/cart/add", { itemId, size });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const updateQuantity = async (itemId, size, quantity) => {
        const updatedCart = structuredClone(cartItems);
        updatedCart[itemId][size] = quantity;
        setCartItems(updatedCart);

        try {
            await axiosInstance.post("/api/cart/update", { itemId, size, quantity });
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

    const getCartAmount = () => {
        let total = 0;
        for (const itemId in cartItems) {
            const product = products.find((p) => p._id === itemId);
            for (const size in cartItems[itemId]) {
                total += (product?.price || 0) * cartItems[itemId][size];
            }
        }
        return total;
    };

    const getProductsData = async () => {
        try {
            const res = await axiosInstance.get("/api/product/list");
            if (res.data.success) {
                setProducts(res.data.products.reverse());
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getUserCart = async (overrideToken) => {
        try {
            const res = await axiosInstance.post(
                "/api/cart/get",
                {},
                {
                    headers: {
                        token: overrideToken || token,
                    },
                }
            );
            if (res.data.success) {
                setCartItems(res.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error("Không thể tải giỏ hàng.");
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedCart = localStorage.getItem("cartItems");

        if (!token && savedToken) {
            setToken(savedToken);
            getUserCart(savedToken);
        } else if (!token && savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (typeof parsed === "object" && parsed !== null) {
                    setCartItems(parsed);
                }
            } catch {
                localStorage.removeItem("cartItems");
            }
        } else if (token) {
            getUserCart();
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems, token]);

    const loginSuccess = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        localStorage.removeItem("cartItems");
        getUserCart(newToken);
    };

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        setCartItems,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        axiosInstance,
        loginSuccess,
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
