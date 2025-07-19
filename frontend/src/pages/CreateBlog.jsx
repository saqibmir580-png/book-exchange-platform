// src/pages/CreateBlog.jsx
import React, { useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "/blogs",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Blog created successfully!");
      setTimeout(() => navigate("/blogs/my"), 1500);
    } catch (err) {
      console.error("Blog creation error:", err.response?.data);
      setMessage("❌ Failed to create blog");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          📝 Create New Blog
        </h2>

        {message && (
          <p
            className={`mb-4 ${
              message.startsWith("❌") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />

          <input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          <textarea
            name="content"
            placeholder="Write your post..."
            value={form.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full border rounded p-2"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Publish
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateBlog;
