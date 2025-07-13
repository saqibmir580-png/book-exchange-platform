import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      setError("❌ Failed to load your books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch {
      alert("❌ Failed to delete book");
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `/books/${editBook._id}`,
        {
          title: editBook.title,
          author: editBook.author,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditBook(null);
      alert("✅ Book updated successfully");
      fetchBooks();
    } catch {
      alert("❌ Failed to update book");
    }
  };

  const handleToggleStatus = async (bookId, newStatus) => {
  try {
    await axios.put(
      `books/status`,
      { 
        bookId: bookId,
        status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchBooks(); // 🔄 Refresh
  } catch {
    alert("❌ Failed to update status");
  }
};


  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">📚 My Books</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-indigo-50 text-indigo-700 font-semibold">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Author</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {editBook?._id === book._id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editBook.title}
                        onChange={(e) =>
                          setEditBook({ ...editBook, title: e.target.value })
                        }
                      />
                    ) : (
                      <span className="font-medium text-gray-800">
                        {book.title}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editBook?._id === book._id ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editBook.author}
                        onChange={(e) =>
                          setEditBook({ ...editBook, author: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-gray-600">{book.author}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={book.status}
                      onChange={(e) =>
                        handleToggleStatus(book._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option value="available"> Available</option>
                      <option value="unavailable"> Unavailable</option>
                       <option value="exchanged">exchanged</option>
                         <option value="requested">requested</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {editBook?._id === book._id ? (
                      <>
                        <button
                          onClick={handleEditSave}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditBook(null)}
                          className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditBook(book)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    You haven’t uploaded any books yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyBooks;
