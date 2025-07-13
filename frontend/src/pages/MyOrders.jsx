import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      setError("❌ Failed to load your orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReturn = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/orders/return/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Book marked as returned");
      fetchOrders();
    } catch {
      alert("❌ Failed to return the book");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    
    console.log(id);
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Order deleted");
      fetchOrders();
    } catch {
      alert("❌ Failed to delete the order");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">📬 My Orders</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Author</th>
                <th className="text-left px-4 py-2">To</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Delivery</th>
                <th className="text-left px-4 py-2">Returned</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
              
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order.bookId?.title}</td>
                  <td className="px-4 py-2">{order.bookId?.author}</td>
                  <td className="px-4 py-2">{order.toUser?.name}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.deliveryStatus}</td>
                  <td className="px-4 py-2">
                    {order.returned ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {!order.returned && order.deliveryStatus === "delivered" && (
                      <button
                        onClick={() => handleReturn(order._id)}
                        className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                      >
                        Return
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-400">
                    No orders placed yet.
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

export default MyOrders;
