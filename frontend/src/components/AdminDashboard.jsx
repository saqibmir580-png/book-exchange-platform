import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
    notReturnedBooks: 0,
    memberships: {},
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [token]);

  const membershipData = Object.entries(stats.memberships).map(
    ([level, count], index) => ({
      name: level,
      value: count,
      fill: COLORS[index % COLORS.length],
    })
  );

  const activityData = [
    { name: "Borrowed", count: stats.borrowedBooks },
    { name: "Returned", count: stats.returnedBooks },
    { name: "Not Returned", count: stats.notReturnedBooks },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          📊 Admin Dashboard
        </h2>

        {/* 📦 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Users" value={stats.totalUsers} color="indigo" />
          <StatCard label="Total Books" value={stats.totalBooks} color="blue" />
          <StatCard label="Books Borrowed" value={stats.borrowedBooks} color="yellow" />
          <StatCard label="Books Returned" value={stats.returnedBooks} color="green" />
          <StatCard label="Books Not Returned" value={stats.notReturnedBooks} color="red" />
        </div>

        {/* 📊 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 🎯 Pie Chart */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              🧩 Membership Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {membershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 📦 Bar Chart */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              📦 Book Activity Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count">
                  <Cell fill="#6366F1" /> {/* Borrowed */}
                  <Cell fill="#10B981" /> {/* Returned */}
                  <Cell fill="#EF4444" /> {/* Not Returned */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// 📦 Stat card component
const StatCard = ({ label, value, color }) => (
  <div className={`bg-${color}-100 p-4 rounded shadow text-center`}>
    <div className={`text-${color}-700 text-xl font-bold`}>{value}</div>
    <div className="text-gray-600 mt-1">{label}</div>
  </div>
);

export default AdminDashboard;
