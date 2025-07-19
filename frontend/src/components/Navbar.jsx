import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  PhoneCall,
  HelpCircle,
  BookMarked,
  LogIn,
  UserPlus,
  Moon,
  Sun,
} from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { name: "About Us", path: "/about", icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { name: "Contact", path: "/contact", icon: <PhoneCall className="h-5 w-5 mr-2" /> },
    { name: "FAQ", path: "/faq", icon: <HelpCircle className="h-5 w-5 mr-2" /> },
  ];

  return (
    <nav className="bg-white text-gray-800 border-b border-gray-200 shadow fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center text-3xl font-extrabold">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9cvH29n6nHI6ebOaFXP9dJ-iYEtOThPoQVA&s" alt="Logo" className="h-10 w-10 mr-3" />
          Kutub<span className="text-indigo-600 dark:text-yellow-300">Net</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center text-lg hover:text-indigo-600 dark:hover:text-yellow-300"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {/* Blogs dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowBlogsDropdown(true)}
            onMouseLeave={() => setShowBlogsDropdown(false)}
          >
            <button className="flex items-center text-lg hover:text-indigo-600 dark:hover:text-yellow-300">
              <BookMarked className="h-5 w-5 mr-2" />
              Blogs
            </button>
            {showBlogsDropdown && (
              <div className="absolute top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-lg w-44 z-50">
                <Link to="/blogs/tech" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Tech Blogs
                </Link>
                <Link to="/blogs/books" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Book Reviews
                </Link>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium"
          >
            <LogIn className="inline w-4 h-4 mr-1" />
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-4 py-2 rounded font-medium"
          >
            <UserPlus className="inline w-4 h-4 mr-1" />
            Register
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 text-xl hover:text-indigo-600 dark:hover:text-yellow-300"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden focus:outline-none">
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-6 pt-2 space-y-4 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-lg"
              onClick={() => setOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Link to="/blogs" onClick={() => setOpen(false)} className="block text-lg">
            <BookMarked className="h-5 w-5 mr-1 inline" />
            Blogs
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block bg-indigo-600 text-white text-center py-2 rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block bg-yellow-400 text-center text-indigo-900 py-2 rounded"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
