import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const DeliveryForm = () => {
  const { state } = useLocation(); // ✅ access bookId, toUser, etc.
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [details, setDetails] = useState({
    fullName: "",
    phone: "",
    pinCode: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setDetails({ ...details, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state?.bookId || !state?.toUser) {
      setError("❌ Missing book or user info.");
      return;
    }

    try {
      const res = await axios.post(
        "/orders",
        {
          bookId: state.bookId,
          toUser: state.toUser,
          deliveryDetails: details,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Order placed successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError("❌ Failed to place order.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          📝 Confirm Delivery Details
        </h2>

        {state?.bookTitle && (
          <div className="bg-gray-100 p-3 rounded mb-4 shadow-sm">
            <p>
              <strong>Book:</strong> {state.bookTitle}
            </p>
            <p>
              <strong>Owner:</strong> {state.ownerName}
            </p>
          </div>
        )}

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={details.fullName}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={details.phone}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <input
            name="pinCode"
            placeholder="Pin Code"
            value={details.pinCode}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={details.address}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          ></textarea>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            ✅ Confirm & Request Book
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryForm;
