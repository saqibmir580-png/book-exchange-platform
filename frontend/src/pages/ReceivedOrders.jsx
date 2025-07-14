import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/received", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      setError("❌ Failed to load received orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status, deliveryStatus) => {
    try {
      await axios.put(
        `/orders/${orderId}/update-status`,
        { status, deliveryStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      alert("❌ Failed to update status.");
    }
  };

  const handleUserDetails = (user, order) => {
    setSelectedUser({
      ...user,
      orderInfo: {
        deliveryDetails: order.deliveryDetails,
        bookTitle: order.bookId?.title,
      },
    });
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          📥 Orders You've Received
        </h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2">📚 Book</th>
                <th className="text-left px-4 py-2">👤 From</th>
                <th className="text-left px-4 py-2">📌 Status</th>
                <th className="text-left px-4 py-2">🚚 Delivery</th>
                <th className="text-left px-4 py-2">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const user = order.fromUser;
                return (
                  <tr key={order._id} className="border-t hover:bg-indigo-50">
                    <td className="px-4 py-2 font-medium">{order.bookId?.title || "Unknown"}</td>
                    <td className="px-4 py-2">{user?.name || "N/A"}</td>
                    <td className="px-4 py-2 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {order.deliveryStatus === "delivered" ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                          ✅ Delivered
                        </span>
                      ) : order.deliveryStatus === "in progress" ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                          🚚 In Progress
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                          ⏳ Not Started
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateStatus(order._id, "accepted", "in progress")}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          ✅ Accept
                        </button>
                      )}

                      {order.status === "accepted" && order.deliveryStatus !== "delivered" && (
                        <button
                          onClick={() => updateStatus(order._id, "completed", "delivered")}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          📦 Mark Delivered
                        </button>
                      )}

                      <button
                        onClick={() => handleUserDetails(user, order)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs"
                      >
                        👁️ View User
                      </button>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                    You haven’t received any book requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🢍 Modal for User Details */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-black"
              >
                ✖
              </button>
              <h3 className="text-xl font-bold text-indigo-600 mb-4">
                📄 Requester & Delivery Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-4 mb-3">
                  {selectedUser.avatar && (
                    <img
                      src={selectedUser.avatar}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <p><strong>Name:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
                  </div>
                </div>

                {selectedUser.orderInfo?.deliveryDetails && (
                  <div className="bg-gray-50 p-3 rounded border text-xs">
                    <p><strong>📦 Delivery Name:</strong> {selectedUser.orderInfo.deliveryDetails.fullName}</p>
                    <p><strong>📍 Address:</strong> {selectedUser.orderInfo.deliveryDetails.address}</p>
                    <p><strong>📬 Pin Code:</strong> {selectedUser.orderInfo.deliveryDetails.pinCode}</p>
                    <p><strong>📞 Contact:</strong> {selectedUser.orderInfo.deliveryDetails.phone}</p>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedUser.orderInfo.deliveryDetails.address + ", " + selectedUser.orderInfo.deliveryDetails.pinCode
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mt-2 block"
                    >
                      📍 View on Google Maps
                    </a>

                    <a
                      href={`https://wa.me/${selectedUser.orderInfo.deliveryDetails.phone}?text=${encodeURIComponent(
                        `Hello ${selectedUser.orderInfo.deliveryDetails.fullName}, I'm delivering your book "${selectedUser.orderInfo.bookTitle}". Please confirm availability.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm"
                    >
                      💬 Message on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReceivedOrders;
