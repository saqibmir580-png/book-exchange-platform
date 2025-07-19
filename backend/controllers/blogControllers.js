const Blog = require("../models/Blog");

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl } = req.body;
    const newBlog = await Blog.create({
      title, excerpt, content, imageUrl,
      author: req.user._id
    });
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err });
  }
};

// Fetch all posts (for admin or public display)
exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });
  res.json(blogs);
};
