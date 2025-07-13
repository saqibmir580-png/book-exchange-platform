import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const groupSize = 3;

  // Fetch testimonials from backend
  useEffect(() => {
    axios
      .get("/testimonials")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error("Failed to load testimonials:", err));
  }, []);

  // Auto-slide group every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroup((prev) =>
        (prev + 1) * groupSize >= testimonials.length ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials]);

  // Grouped data
  const start = currentGroup * groupSize;
  const visibleTestimonials = testimonials.slice(start, start + groupSize);

  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-indigo-700 mb-10">
          💬 What Our Users Say
        </h2>

        {visibleTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition"
              >
                <p className="text-gray-700 italic mb-4">“{t.message}”</p>
                <div className="flex items-center mt-4">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover mr-3 border"
                    />
                  )}
                  <div>
                    <p className="text-indigo-600 font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No testimonials available yet.</p>
        )}

        {/* Dots Navigation */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({
            length: Math.ceil(testimonials.length / groupSize),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGroup(index)}
              className={`h-3 w-3 rounded-full ${
                index === currentGroup ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
