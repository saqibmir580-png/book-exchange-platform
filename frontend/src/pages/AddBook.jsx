import React, { useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
const AddBook = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    author: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      if (imageFile) data.append("image", imageFile);

      const res = await axios.post("/books/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("📚 Book added successfully!");
      navigate('/dashboard')
      setFormData({ title: "", author: "" });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      setError(err?.response?.data?.message || "❌ Failed to add book");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            ➕ Add New Book
          </h2>

          {message && <p className="text-green-600 mb-3">{message}</p>}
          {error && <p className="text-red-500 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="input"
              required
            />
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              className="input"
              required
            />

            <div className="flex flex-col items-center">
              {preview && (
                <img
                  src={preview}
                  alt="Book Preview"
                  className="w-32 h-44 object-cover mb-2 rounded border"
                />
              )}
              <label className="cursor-pointer text-indigo-600 underline">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
                Upload Cover Image
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
            >
              Add Book
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddBook;
