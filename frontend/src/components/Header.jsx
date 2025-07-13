import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile from backend
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
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
      <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>

      <div className="flex items-center space-x-4">
        {/* Notification icon */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info Button */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={togglePopup}>
          <img
            src={user?.avatar || "https://i.pravatar.cc/40"}
            alt="user avatar"
            className="h-9 w-9 rounded-full object-cover border border-gray-300"
          />
          <div className="text-sm text-gray-800 font-medium">{user?.name || "User"}</div>
        </div>

        {/* Logout Button */}
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-sm rounded-md"   onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Profile Popup */}
      {showPopup && user && (
        <div className="absolute top-16 right-6 bg-white shadow-lg rounded-md border p-4 w-64 z-50">
          <div className="text-center">
            <img
              src={user.avatar}
              alt="user avatar"
              className="w-20 h-20 mx-auto rounded-full object-cover border mb-2"
            />
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">Role: {user.role}</p>
             <p className="text-xs text-gray-400 mt-1">Phone: {user.phone}</p>
            <p className="text-xs text-gray-400">Membership: {user.membershipLevel}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
