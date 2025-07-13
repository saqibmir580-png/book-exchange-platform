import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ReceivedBooks = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchReturnedBooks = async () => {
    try {
      const res = await axios.get("/orders/returned-to-me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching returned books.");
    }
  };

  const confirmReceived = async (orderId) => {
    setLoading(true);
    try {
      await axios.put(
        `/orders/confirm-return/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchReturnedBooks(); // Refresh
    } catch (err) {
      alert("❌ Failed to confirm received.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          📦 Books Returned Back to You
        </h2>

        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">📘 Book</th>
              <th className="px-4 py-2 text-left">👤 Borrower</th>
              <th className="px-4 py-2 text-left">📅 Returned On</th>
              <th className="px-4 py-2 text-left">✅ Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{order.bookId?.title}</td>
                <td className="px-4 py-2">{order.fromUser?.name}</td>
                <td className="px-4 py-2">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => confirmReceived(order._id)}
                    className={`bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 ${
                      loading ? "opacity-50" : ""
                    }`}
                  >
                    ✅ Confirm Received
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 italic py-4">
                  No returned books waiting to be confirmed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ReceivedBooks;
