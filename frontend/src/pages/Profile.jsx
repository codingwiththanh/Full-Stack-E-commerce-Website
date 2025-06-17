import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const Profile = () => {
  const { token, axiosInstance } = useContext(ShopContext);
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error(
          "Không thể tải thông tin người dùng",
          err?.response || err
        );
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user._id) return alert("Không tìm thấy ID người dùng để cập nhật.");

    try {
      const updateUser = axiosInstance.put(`/api/user/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let changePassword = Promise.resolve();

      if (showPasswordFields) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }

        changePassword = axiosInstance.put(
          `/api/user/${user._id}/password`,
          passwordData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      await Promise.all([updateUser, changePassword]);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật", err?.response || err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col sm:flex-row justify-center items-center my-8 gap-8 flex-wrap shadow-2xl w-[90%] max-w-4xl bg-white">
        <div className="w-[405px] h-[525px]">
          <img
            src={assets.contact3}
            alt="Hình minh họa đăng nhập"
            className="object-cover w-full h-full"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full sm:w-[45%] gap-4 text-gray-800"
        >
          <Title text1={"TÀI KHOẢN"} text2={"CỦA BẠN"} />
          <input
            type="text"
            name="name"
            placeholder="Tên"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
          />

          <button
            type="button"
            className="text-blue-600 underline text-sm text-left"
            onClick={() => setShowPasswordFields((prev) => !prev)}
          >
            {showPasswordFields ? "Huỷ đổi mật khẩu" : "Đổi mật khẩu"}
          </button>

          {showPasswordFields && (
            <>
              <input
                type="password"
                name="currentPassword"
                placeholder="Mật khẩu hiện tại"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-stone-900 text-[#FF1461] uppercase font-medium px-8 py-2 mt-4 hover:bg-neutral-600 transition w-full"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
