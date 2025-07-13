import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    pinCode: "",
    address: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load user from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setFormData({
        name: decoded.name || "",
        email: decoded.email || "",
        pinCode: decoded.pinCode || "",
        address: decoded.address || "",
        phone: decoded.phone || "",
      });
      setAvatarPreview(decoded.avatar || null);
    } catch {
      setError("Invalid token");
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value); // Only append filled fields
      });
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await axios.put("/users/update-user-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Profile updated!");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "❌ Failed to update");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(10vh-4rem)] bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6">👤 Edit Profile</h2>

          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Avatar Upload */}
            <div className="col-span-full text-center">
              <label className="inline-block relative cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <img
                  src={avatarPreview || "https://via.placeholder.com/100"}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-indigo-500"
                />
                <span className="block text-sm text-indigo-600 mt-2 underline">
                  Change Avatar
                </span>
              </label>
            </div>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="input border px-3 py-2 rounded"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="input border px-3 py-2 rounded"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              type="tel"
              className="input border px-3 py-2 rounded"
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password (leave blank to keep current)"
              type="password"
              className="input border px-3 py-2 rounded"
            />
            <input
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="Pin Code"
              className="input border px-3 py-2 rounded"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="input border px-3 py-2 rounded"
            />

            <div className="col-span-full mt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
