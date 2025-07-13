import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ReturnedBooks = () => {
  const [returnedOrders, setReturnedOrders] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchReturnedOrders = async () => {
    try {
      const res = await axios.get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data.filter((order) => order.returned === true);
      setReturnedOrders(filtered);
    } catch (err) {
      setError("❌ Failed to fetch returned books.");
    }
  };

  useEffect(() => {
    fetchReturnedOrders();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">📕 Returned Books</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="px-4 py-2">📚 Book</th>
                <th className="px-4 py-2">👤 Owner</th>
                <th className="px-4 py-2">🚚 Delivery</th>
                <th className="px-4 py-2">🔁 Returned On</th>
              </tr>
            </thead>
            <tbody>
              {returnedOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order.bookId?.title || "N/A"}</td>
                  <td className="px-4 py-2">{order.toUser?.name || "N/A"}</td>
                  <td className="px-4 py-2 capitalize">{order.deliveryStatus}</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">✅ Returned</td>
                </tr>
              ))}
              {returnedOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    You haven’t returned any books yet.
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

export default ReturnedBooks;
