import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setMessage("❌ Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(
        `/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Role updated");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to update role");
    }
  };

  const updateMembership = async (userId, newLevel) => {
    try {
      await axios.put(
        `/admin/users/${userId}/membership`,
        { membershipLevel: newLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Membership updated");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to update membership");
    }
  };

  const toggleApprove = async (userId, isApproved) => {
    try {
      await axios.put(
        `/admin/users/${userId}/approve`,
        { isApproved: !isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(isApproved ? "✅ User unapproved" : "✅ User approved");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to update approval");
    }
  };

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await axios.put(
        `/admin/users/${userId}/block`,
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(isBlocked ? "✅ User unblocked" : "✅ User blocked");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to update block status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Confirm delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ User deleted");
      fetchUsers();
    } catch {
      setMessage("❌ Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">🛡️ Manage Users</h2>
        {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-2 text-left">👤 Name</th>
                <th className="px-4 py-2 text-left">📧 Email</th>
                <th className="px-4 py-2 text-left">📱 Phone</th>
                <th className="px-4 py-2 text-left">🏷️ Role</th>
                <th className="px-4 py-2 text-left">💎 Membership</th>
                <th className="px-4 py-2 text-left">✅ Approved</th>
                <th className="px-4 py-2 text-left">⛔ Block</th>
                <th className="px-4 py-2 text-left">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.phone || "N/A"}</td>

                  <td className="px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-4 py-2">
                    <select
                      value={u.membershipLevel}
                      onChange={(e) => updateMembership(u._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleApprove(u._id, u.isApproved)}
                      className={`text-xs px-3 py-1 rounded ${
                        u.isApproved
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                    >
                      {u.isApproved ? "Approved" : "Approve"}
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleBlock(u._id, u.isBlocked)}
                      className={`text-xs px-3 py-1 rounded ${
                        u.isBlocked
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 italic">
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

export default ManageUsers;
