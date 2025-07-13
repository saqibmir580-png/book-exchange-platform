import { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import LineGraph from "../components/LineGraph";
import PieChartBox from "../components/PieChartBox";
import { Library, Upload, ShoppingBag, Star } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const COLORS = ["#6366f1", "#34d399", "#fbbf24", "#f87171", "#60a5fa"];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { totalBooks, booksUploaded, booksOrdered, membershipLevel } = res.data.stats;

        setStats([
          {
            label: "Total Books",
            value: totalBooks,
            icon: <Library className="h-8 w-8 text-indigo-500" />,
            bg: "bg-indigo-100",
          },
          {
            label: "Books Uploaded",
            value: booksUploaded,
            icon: <Upload className="h-8 w-8 text-green-500" />,
            bg: "bg-green-100",
          },
          {
            label: "Books Ordered",
            value: booksOrdered,
            icon: <ShoppingBag className="h-8 w-8 text-yellow-500" />,
            bg: "bg-yellow-100",
          },
          {
            label: "Membership",
            value: membershipLevel,
            icon: <Star className="h-8 w-8 text-orange-500" />,
            bg: "bg-orange-100",
          },
        ]);

        setChartData(res.data.chartData);
        setCategoryData(res.data.categoryData);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineGraph data={chartData} />
        <PieChartBox data={categoryData} colors={COLORS} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
