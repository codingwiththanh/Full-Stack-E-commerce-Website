import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "VNĐ";
  const delivery_fee = 30000;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [isAppReady, setIsAppReady] = useState(false);

  const axiosInstance = axios.create({
    baseURL: backendUrl,
  });
  
  axiosInstance.interceptors.request.use(
    (config) => {
      const storedToken = localStorage.getItem("token") || token;
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  axiosInstance.interceptors.response.use(
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
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Error in addToCart:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const updatedCart = structuredClone(cartItems);
    if (quantity === 0) {
      if (updatedCart[itemId]) {
        delete updatedCart[itemId][size];
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
      }
    } else {
      updatedCart[itemId][size] = quantity;
    }
    setCartItems(updatedCart);

    try {
      await axiosInstance.post("/api/cart/update", { itemId, size, quantity });
      toast.success("Cập nhật giỏ hàng thành công");
    } catch (error) {
      console.error("Error in updateQuantity:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng");
    }
  };

  const placeOrder = async (orderData) => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    if (!orderData.items || orderData.items.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/order/place", orderData);
      if (response.data.success) {
        toast.success("Đặt hàng thành công!");
        setCartItems(response.data.updatedCartData || {});
        return response.data.orderId;
      } else {
        toast.error(response.data.message || "Lỗi khi đặt hàng");
      }
    } catch (error) {
      console.error("Error in placeOrder:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
      throw error;
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

  const getSelectedCartAmount = (selectedItems) => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      for (const size in cartItems[itemId]) {
        if (selectedItems.includes(`${itemId}-${size}`)) {
          total += (product?.price || 0) * cartItems[itemId][size];
        }
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
        toast.error(res.data.message || "Lỗi khi tải sản phẩm");
      }
    } catch (error) {
      console.error("Error in getProductsData:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tải sản phẩm");
    }
  };

  const getUserCart = async () => {
    try {
      const res = await axiosInstance.post("/api/cart/get", {});
      if (res.data.success) {
        setCartItems(res.data.cartData);
      }
    } catch (error) {
      console.error("Error in getUserCart:", error);
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
      getUserCart().finally(() => setIsAppReady(true));
    } else if (!token && savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (typeof parsed === "object" && parsed !== null) {
          setCartItems(parsed);
        }
      } catch {
        localStorage.removeItem("cartItems");
      } finally {
        setIsAppReady(true);
      }
    } else {
      getUserCart().finally(() => setIsAppReady(true));
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
    getSelectedCartAmount,
    placeOrder,
    navigate,
    backendUrl,
    setToken,
    token,
    axiosInstance,
    loginSuccess,
  };

  if (!isAppReady) return null;
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
