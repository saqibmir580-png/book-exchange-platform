import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Profile from "./pages/Profile";
import AddBook from "./pages/AddBook";
import BookList from "./pages/BookList";
import MyBooks from "./pages/MyBook";
import MyOrders from "./pages/MyOrders";
import ReceivedOrders from "./pages/ReceivedOrders";
import Home from "./pages/Home";
import CreateTestimonial from "./pages/CreateTestimonial";
import DeliveryForm from "./pages/DeliveryForm";
import ReturnedBooks from "./pages/ReturnedBooks";
import ReceivedBooks from "./pages/ReceivedBooks";
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
          <Route path="/returns" element={<ReturnedBooks/>} />
          <Route path="/books/received" element={<ReceivedBooks />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
