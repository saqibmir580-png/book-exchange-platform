import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ManageMemberships = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError("❌ Failed to fetch users");
    }
  };

  const handleMembershipChange = async (userId, newLevel) => {
    try {
      await axios.put(
        `/admin/users/${userId}/membership`,
        { membershipLevel: newLevel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // Refresh data after update
    } catch (err) {
      alert("❌ Failed to update membership");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">🏷️ Manage Memberships</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-100 text-indigo-700 font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">👤 Name</th>
                <th className="px-4 py-3 text-left">📧 Email</th>
                <th className="px-4 py-3 text-left">🎖️ Membership</th>
                <th className="px-4 py-3 text-left">⚙️ Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.membershipLevel}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.membershipLevel}
                      onChange={(e) =>
                        handleMembershipChange(user._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                    No users found.
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

export default ManageMemberships;
