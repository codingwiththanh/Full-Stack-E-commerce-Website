import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate, currency, token, placeOrder, delivery_fee, products } =
    useContext(ShopContext);
  const { state } = useLocation();
  const { selectedCartData = [] } = state || {};
  const [formData, setFormData] = useState({
    ten: "",
    ho: "",
    email: "",
    duongSonha: "",
    phuongXa: "",
    quanHuyen: "",
    thanhPho: "",
    dienThoai: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!token) {
        toast.warning("Vui lòng đăng nhập để đặt hàng!");
        navigate("/login");
        return;
      }

      if (!selectedCartData.length) {
        toast.error("Không có sản phẩm nào được chọn để đặt hàng!");
        navigate("/cart");
        return;
      }

      // ⚠️ Kiểm tra thông tin bắt buộc
      const requiredFields = [
        "ten",
        "ho",
        "email",
        "duongSonha",
        "phuongXa",
        "quanHuyen",
        "thanhPho",
        "dienThoai",
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(
            `Vui lòng điền đủ thông tin!`
          );
          return;
        }
      }

      if (!/^\d{10}$/.test(formData.dienThoai)) {
        toast.error("Số điện thoại phải có 10 chữ số!");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Email không hợp lệ!");
        return;
      }

      if (method === "napas") {
        toast.warning("Phương thức thanh toán Napas chưa được hỗ trợ!");
        return;
      }

      // Tính tổng tiền
      let totalAmount = 0;
      for (const item of selectedCartData) {
        const product = products.find((p) => p._id === item._id);
        if (!product) {
          toast.error(`Sản phẩm ${item._id} không tồn tại!`);
          return;
        }
        totalAmount += product.price * item.quantity;
      }

      const finalAmount = totalAmount + delivery_fee;

      const orderData = {
        items: selectedCartData,
        address: formData,
        amount: finalAmount,
        paymentMethod: method,
        payment: method === "cod" ? true : false,
      };

      const orderId = await placeOrder(orderData);
      if (orderId) {
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error in placeOrder:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
    }
  };

  const selectedItems = selectedCartData.map(
    (item) => `${item._id}-${item.size}`
  );

  if (!selectedCartData.length) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">Không có sản phẩm nào được chọn!</p>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-neutral-900 text-white px-6 py-2"
        >
          Quay lại giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-[40px] min-h-[80vh] px-4"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl">
          <Title text1={"THÔNG TIN"} text2={"VẬN CHUYỂN"} />
        </div>
        <div className="flex gap-3 mt-4">
          <input
            name="ho"
            value={formData.ho}
            onChange={onChangeHandler}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Họ"
          />
          <input
            name="ten"
            value={formData.ten}
            onChange={onChangeHandler}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Tên"
          />
        </div>
        <input
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="email"
          placeholder="Địa chỉ email"
        />
        <input
          name="dienThoai"
          value={formData.dienThoai}
          onChange={onChangeHandler}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Điện thoại"
        />
        <input
          name="duongSonha"
          value={formData.duongSonha}
          onChange={onChangeHandler}
          className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
          type="text"
          placeholder="Đường"
        />
        <div className="flex gap-3">
          <input
            name="phuongXa"
            value={formData.phuongXa}
            onChange={onChangeHandler}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Phường"
          />
          <input
            name="quanHuyen"
            value={formData.quanHuyen}
            onChange={onChangeHandler}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Quận"
          />
          <input
            name="thanhPho"
            value={formData.thanhPho}
            onChange={onChangeHandler}
            className="border border-gray-300 py-1.5 px-3.5 w-full rounded"
            type="text"
            placeholder="Thành phố"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="mt-8 w-full sm:max-w-[480px]">
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Sản phẩm được chọn</h3>
          {selectedCartData.map((item, index) => {
            const productData = products.find((p) => p._id === item._id);
            if (!productData) return null;
            return (
              <div key={index} className="flex gap-4 border-b py-2">
                <img
                  className="w-16 h-16 object-cover rounded"
                  src={productData.image[0]}
                  alt={productData.name}
                />
                <div>
                  <p className="text-sm font-medium">{productData.name}</p>
                  <p className="text-xs">Kích cỡ: {item.size}</p>
                  <p className="text-xs">Số lượng: {item.quantity}</p>
                  <p className="text-xs">
                    Giá:{" "}
                    {(productData.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    {currency}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10">
          <CartTotal
            selectedItems={selectedItems}
            cartData={selectedCartData}
          />
        </div>
        <div className="mt-8">
          <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"} />
          <div className="flex gap-2 flex-col lg:flex-row">
            <div
              className={`h-[48px] border border-gray-300 lg:w-1/2 cursor-pointer transition duration-200 flex items-center justify-center ${
                method === "napas" ? "border-black ring-2 ring-black" : ""
              }`}
              onClick={() => setMethod("napas")}
            >
              <img className="h-[32px]" src={assets.sepay} alt="Napas" />
            </div>
            <div
              className={`h-[48px] border border-gray-300 lg:w-1/2 cursor-pointer transition duration-200 flex items-center justify-center ${
                method === "cod" ? "border-black ring-2 ring-black" : ""
              }`}
              onClick={() => setMethod("cod")}
            >
              <p className="text-gray-500 text-sm font-medium">
                THANH TOÁN KHI GIAO HÀNG
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 w-full h-[48px] bg-black text-white px-16 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedCartData.length}
          >
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
