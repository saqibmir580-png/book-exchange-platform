import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch {
      setMessage("❌ Failed to fetch blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const toggleShow = async (id) => {
    try {
      await axios.put(
        `/admin/blogs/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlogs();
    } catch {
      setMessage("❌ Failed to update blog visibility");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch {
      setMessage("❌ Failed to delete blog");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">📰 Manage Blogs</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">📝 Title</th>
                <th className="px-4 py-2 text-left">📃 Content</th>
                <th className="px-4 py-2 text-left">🏠 Show on Home</th>
                <th className="px-4 py-2 text-left">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{b.title}</td>
                  <td className="px-4 py-2 line-clamp-2">{b.content.slice(0, 100)}...</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        b.showOnHome
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {b.showOnHome ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleShow(b._id)}
                      className="bg-indigo-600 text-white text-xs px-3 py-1 rounded"
                    >
                      {b.showOnHome ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6 italic">
                    No blogs found.
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

export default ManageBlogs;
