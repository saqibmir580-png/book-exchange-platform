import React from "react";

const AboutSection = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-indigo-700">
          📚 About <span className="text-yellow-500">BookExchange</span>
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          A platform where readers connect, exchange books, and inspire each other to read more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1553729459-efe14ef6055d"
          alt="People exchanging books"
          className="rounded-lg shadow-lg w-full h-72 object-cover"
        />
        <div>
          <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Why Choose Us?</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            BookExchange helps reduce waste and build a stronger reading culture by giving every book a second life.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>🌍 Eco-friendly sharing economy</li>
            <li>👥 Community of readers & learners</li>
            <li>💸 Budget-friendly way to read</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
