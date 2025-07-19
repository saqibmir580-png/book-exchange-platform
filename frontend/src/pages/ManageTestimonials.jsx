import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/admin/testimonials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestimonials(res.data);
    } catch {
      setMessage("❌ Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const toggleShow = async (id) => {
    try {
      await axios.put(`/admin/testimonials/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTestimonials();
    } catch {
      setMessage("❌ Could not update visibility");
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await axios.delete(`/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTestimonials();
    } catch {
      setMessage("❌ Could not delete testimonial");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🗂 Manage Testimonials</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}

        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">👤 User</th>
                <th className="px-4 py-2 text-left">💬 Message</th>
                <th className="px-4 py-2 text-left">🏠 Show on Home</th>
                <th className="px-4 py-2 text-left">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{t.user?.name || "Anonymous"}</td>
                  <td className="px-4 py-2">{t.message}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        t.showOnHome
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.showOnHome ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => toggleShow(t._id)}
                      className="bg-indigo-600 text-white text-xs px-3 py-1 rounded"
                    >
                      {t.showOnHome ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t._id)}
                      className="bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6 italic">
                    No testimonials found.
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

export default ManageTestimonials;
