import React, { useState } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const CreateTestimonial = () => {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("❌ Please log in to submit testimonial.");
      return;
    }

    try {
      await axios.post(
        "/testimonials",
        { message: feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Testimonial submitted successfully!");
      setFeedback("");
    } catch (err) {
      setError("❌ Failed to submit testimonial.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">✍️ Share Your Experience</h2>

        {message && <p className="text-green-600 mb-3">{message}</p>}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="6"
            placeholder="Write your experience here..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
            required
          />

          <button
            type="submit"
            className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow font-semibold"
          >
            Submit Testimonial
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTestimonial;
