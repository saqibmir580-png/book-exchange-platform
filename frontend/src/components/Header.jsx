import React, { useEffect, useState } from "react";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/users/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  const togglePopup = () => setShowPopup((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      {/* ☰ Mobile Menu Icon */}
      <button
        className="text-gray-700 focus:outline-none lg:hidden mr-2"
        onClick={onMenuClick}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* 📊 Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">📊 Dashboard</h1>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* 🔔 Notification Icon */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* 👤 User Button */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={togglePopup}
        >
          <img
            src={user?.avatar || "https://i.pravatar.cc/40"}
            alt="user avatar"
            className="h-9 w-9 rounded-full object-cover border border-gray-300"
          />
          <span className="hidden sm:block text-sm text-gray-800 font-medium">
            {user?.name || "User"}
          </span>
        </div>

        {/* 🚪 Logout Button */}
        <button
          className="hidden sm:block bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-md"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* 👤 Popup */}
      {showPopup && user && (
        <div className="absolute top-16 right-4 sm:right-6 bg-white shadow-lg rounded-md border p-4 w-64 z-50">
          <div className="text-center">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-20 h-20 mx-auto rounded-full object-cover border mb-2"
            />
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400">Role: {user.role}</p>
            <p className="text-xs text-gray-400">Phone: {user.phone}</p>
            <p className="text-xs text-gray-400">Membership: {user.membershipLevel}</p>
            <button
              className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-1 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
