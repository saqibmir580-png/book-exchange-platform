import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        axios.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(userRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateMembership = async (userId, newStatus) => {
    try {
      await axios.put(
        `/admin/users/${userId}/membership`,
        { membership: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error("Failed to update membership");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">🛠️ Admin Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-bold text-indigo-800">Users</h4>
            <p className="text-xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-bold text-green-800">Books</h4>
            <p className="text-xl">{stats.totalBooks}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-bold text-yellow-800">Orders</h4>
            <p className="text-xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-pink-100 p-4 rounded shadow text-center">
            <h4 className="text-lg font-bold text-pink-800">Testimonials</h4>
            <p className="text-xl">{stats.totalTestimonials}</p>
          </div>
        </div>

        {/* Membership Management */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">👥 Manage Membership</h3>
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Membership</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 capitalize">{user.membership || "basic"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => updateMembership(user._id, "basic")}
                      className="bg-gray-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Basic
                    </button>
                    <button
                      onClick={() => updateMembership(user._id, "premium")}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Premium
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
