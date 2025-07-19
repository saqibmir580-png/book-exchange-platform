import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import Profile from "./pages/Profile.jsx";
import AddBook from "./pages/AddBook.jsx";
import BookList from "./pages/BookList.jsx";
import MyBooks from "./pages/MyBook.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import ReceivedOrders from "./pages/ReceivedOrders.jsx";
import Home from "./pages/Home.jsx";
import CreateTestimonial from "./pages/CreateTestimonial.jsx";
import DeliveryForm from "./pages/DeliveryForm.jsx";
import ReturnedBooks from "./pages/ReturnedBooks.jsx";
import ReceivedBooks from "./pages/ReceivedBooks.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import ManageMemberships from "./pages/ManageMemberships.jsx";
import ManageTestimonials from "./pages/ManageTestimonials.jsx";
import ManageBlogs from "./pages/ManageBlogs.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/books/upload" element={<AddBook />} />
          <Route path="/books/all" element={<BookList />} />
          <Route path="/books/my" element={<MyBooks />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/received" element={<ReceivedOrders />} />
          <Route path="/testimonial/create" element={<CreateTestimonial />} />
          <Route path="/delivery" element={<DeliveryForm />} />
          <Route path="/returns" element={<ReturnedBooks />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/books/received" element={<ReceivedBooks />} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/memberships" element={<ManageMemberships />} />
           <Route path="/admin/testimonials" element={<ManageTestimonials />} />
           <Route path="/admin/blogs" element={<ManageBlogs />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
