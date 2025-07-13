import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import BookCard from "../components/BookCard";
import DashboardLayout from "../components/DashboardLayout";
const BookList = () => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUserId(decoded.id); // or decoded._id based on your token payload

    axios
      .get("/books/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Exclude books owned by the current user
        const filteredBooks = res.data.filter(
          (book) => book.ownerId !== decoded.id
        );
        setBooks(filteredBooks);
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
      });
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">📚 Available Books</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} userId={userId} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookList;
