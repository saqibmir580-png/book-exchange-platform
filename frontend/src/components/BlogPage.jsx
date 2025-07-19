import React from "react";

const blogPosts = [
  {
    id: 1,
    title: "Why Book Sharing is the Future 📚",
    author: "Team BookExchange",
    date: "July 15, 2025",
    excerpt:
      "Explore how sharing books promotes sustainability, accessibility, and builds stronger communities.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f", // books table
  },
  {
    id: 2,
    title: "10 Must-Read Books of This Year 🔥",
    author: "Aarav Jain",
    date: "July 10, 2025",
    excerpt:
      "From fiction to memoirs, discover what readers are raving about on BookExchange this year.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794", // stack of books
  },
  {
    id: 3,
    title: "Eco Benefits of Sharing Books 🌱",
    author: "Sara Mir",
    date: "July 5, 2025",
    excerpt:
      "Reduce waste and save trees — how book reuse helps the planet one read at a time.",
    image: "https://media.istockphoto.com/id/1389876555/photo/adult-students-studying-together-in-library.jpg?s=612x612&w=0&k=20&c=QBMntuBagQv0Ls4JynPfI2FqQIxNk4b7d37vTNzxf1I=", // green theme
  },
  {
    id: 4,
    title: "How to Build Your Reading Habit 📖",
    author: "Fahad Qureshi",
    date: "June 29, 2025",
    excerpt:
      "Simple tips to stay consistent and fall in love with reading again using BookExchange.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac", // reading
  },
];

const BlogSlider = () => {
  return (
    <div className="py-12 bg-gray-50 px-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        📰 Latest Blog Insights
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] max-w-sm bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-indigo-700">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                ✍️ {post.author} • 📅 {post.date}
              </p>
              <p className="text-sm text-gray-700 mb-2">{post.excerpt}</p>
              <button className="text-sm text-indigo-600 hover:underline font-medium">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSlider;
