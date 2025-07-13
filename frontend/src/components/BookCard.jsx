import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const owner = book.ownerId;

  const handleRequest = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("❌ Please login to request a book");
    if (!owner?._id) return alert("❌ Owner info missing");

    // ✅ Pass book & owner info to delivery form
    navigate("/delivery", {
      state: {
        bookId: book._id,
        toUser: owner._id,
        bookTitle: book.title,
        ownerName: owner.name,
      },
    });
  };

  const whatsappLink = owner?.phone
    ? `https://wa.me/${owner.phone}?text=${encodeURIComponent(
        `Hello ${owner.name}, I'm interested in your book "${book.title}" listed on BookExchange.`
      )}`
    : "#";

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      {book.image && (
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      <div>
        <h3 className="text-lg font-bold text-indigo-700">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-1">By {book.author}</p>
        <p className="text-sm text-gray-500 mb-2">
          Owner: <strong>{owner?.name || "Unknown"}</strong>
        </p>
      </div>

      <div className="mt-2 space-y-2">
        <button
          onClick={handleRequest}
          disabled={!owner?._id}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded text-sm"
        >
          📦 Request Book
        </button>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-center ${
            owner?.phone
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          } text-white py-1.5 rounded text-sm`}
        >
          💬 Message on WhatsApp
        </a>
      </div>
    </div>
  );
};

export default BookCard;
