import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Profile = () => {
    const { token } = useContext(ShopContext);
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
                const res = await axios.get("/api/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User info:", res.data);
                setUser(res.data);
                setFormData({
                    name: res.data.name || "",
                    email: res.data.email || "",
                });
            } catch (err) {
                console.error("Không thể tải thông tin người dùng", err?.response || err);
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

        if (!user._id) {
            alert("Không tìm thấy ID người dùng để cập nhật.");
            return;
        }

        try {
            console.log("Token gửi lên:", token);

            const updateUser = axios.put(`/api/user/${user._id}`, formData, {
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

                changePassword = axios.put(
                    `/api/user/${user._id}/password`,
                    passwordData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
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
        <div className="max-w-xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-semibold mb-4">Thông tin tài khoản</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Tên"
                    value={formData.name}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded"
                />

                <button
                    type="button"
                    className="text-blue-600 underline text-sm text-left"
                    onClick={() => setShowPasswordFields((prev) => !prev)}
                >
                    {showPasswordFields ? "Ẩn đổi mật khẩu" : "Đổi mật khẩu"}
                </button>

                {showPasswordFields && (
                    <>
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Mật khẩu hiện tại"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="border px-4 py-2 rounded"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="border px-4 py-2 rounded"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="border px-4 py-2 rounded"
                        />
                    </>
                )}

                <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded hover:opacity-80"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
};

export default Profile;
