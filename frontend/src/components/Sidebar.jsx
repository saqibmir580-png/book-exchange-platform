import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Upload,
  Library,
  User,
  LayoutDashboard,
  List,
  RotateCcw,
  MessageCircleHeart,
  Inbox,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Books', to: '/books/my', icon: <BookOpen size={20} /> },
    { name: 'Upload Book', to: '/books/upload', icon: <Upload size={20} /> },
    { name: 'Display Books', to: '/books/all', icon: <Library size={20} /> },
    { name: 'List Book Order', to: '/orders', icon: <List size={20} /> },
   { name: "Orders Received", to: "/orders/received", icon: <Inbox size={20} /> },
    { name: 'Return Books', to: '/returns', icon: <RotateCcw size={20} /> },
    { name: 'Received Books', to: '/books/received', icon: <BookOpen size={20} /> },
    { name: "Testimonials", to: "/testimonial/create", icon: <MessageCircleHeart size={20} /> },
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },

  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold border-b text-indigo-600">
        📚 Book Exchange
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(({ name, to, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all
              ${location.pathname === to
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'}`}
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
