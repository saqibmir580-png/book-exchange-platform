import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, Upload, Library, User, LayoutDashboard, List,
  RotateCcw, MessageCircleHeart, Inbox, Users, ShieldCheck, Newspaper
} from 'lucide-react';
import axios from '../api/axios';

const Sidebar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserRole(null);
      return;
    }

    axios.get("/users/get-profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUserRole(res.data.role))
    .catch(err => {
      console.error("Failed to fetch user role", err);
      setUserRole(null);
    });
  }, []);

  const userMenu = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Books', to: '/books/my', icon: <BookOpen size={20} /> },
    { name: 'Upload Book', to: '/books/upload', icon: <Upload size={20} /> },
    { name: 'Display Books', to: '/books/all', icon: <Library size={20} /> },
    { name: 'List Book Order', to: '/orders', icon: <List size={20} /> },
    { name: 'Orders Received', to: '/orders/received', icon: <Inbox size={20} /> },
    { name: 'Return Books', to: '/returns', icon: <RotateCcw size={20} /> },
    { name: 'Received Books', to: '/books/received', icon: <BookOpen size={20} /> },
    { name: 'Create Blog', to: '/blogs/create', icon: <Newspaper size={20} /> },
    { name: 'Testimonials', to: '/testimonial/create', icon: <MessageCircleHeart size={20} /> },
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },
  ];

  const adminMenu = [
    { name: 'Admin Dashboard', to: '/admin', icon: <ShieldCheck size={20} /> },
    { name: 'Manage Users', to: '/admin/users', icon: <Users size={20} /> },
    { name: 'Memberships', to: '/admin/memberships', icon: <ShieldCheck size={20} /> },
    { name: 'Manage Blogs', to: '/admin/blogs', icon: <Newspaper size={20} /> },
     { name: 'Create Blog', to: '/blogs/create', icon: <Newspaper size={20} /> },
    { name: 'Manage Testimonials', to: '/admin/testimonials', icon: <MessageCircleHeart size={20} /> },
  ];

  let menuItems = [];
  if (userRole === "admin") {
    menuItems = [...adminMenu];
  } else if (userRole === "user") {
    menuItems = [...userMenu];
  }

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold border-b text-indigo-600">📚 Book Exchange</div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(({ name, to, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
              location.pathname === to
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
