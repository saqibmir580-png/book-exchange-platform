const User = require("../models/User");
const Book = require("../models/Book");
const Order = require("../models/Order");
const Testimonial = require("../models/Testimonial");
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();

    const borrowedBooks = await Order.countDocuments({
      status: "accepted",
      deliveryStatus: { $ne: "returned" },
    });

    const returnedBooks = await Order.countDocuments({
      status: "completed",
      returned: true,
      returnConfirmed: true,
    });

    const notReturnedBooks = await Order.countDocuments({
      status: "completed",
      returned: false,
    });

    const memberships = await User.aggregate([
      {
        $group: {
          _id: "$membershipLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const membershipData = {};
    memberships.forEach((m) => {
      membershipData[m._id] = m.count;
    });

    res.json({
      totalUsers,
      totalBooks,
      borrowedBooks,
      returnedBooks,
      notReturnedBooks,
      memberships: membershipData,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
};

// 🧾 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch users" });
  }
};

// 🔁 Update membership level
exports.updateUserMembership = async (req, res) => {
  const { id } = req.params;
  const { membershipLevel } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { membershipLevel },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "✅ Membership updated", user });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to update membership" });
  }
};

// ❌ Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "✅ User deleted" });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to delete user" });
  }
};
exports.blockUser = async (req, res) => {
  try {
    const { blocked } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked },
      { new: true }
    );
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getalltestimonials = async (req, res) => {
  const all = await Testimonial.find().populate("user", "name email");
  res.json(all);
};
exports.toggleTestimonialVisibility = async (req, res) => {
  const t = await Testimonial.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Not found" });
  t.showOnHome = !t.showOnHome;
  await t.save();
  res.json(t);
};
exports.deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
// GET all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// TOGGLE showOnHome
exports.toggleBlogVisibility = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.showOnHome = !blog.showOnHome;
    await blog.save();
    res.json({ message: "Visibility updated", blog });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//approve the user
exports.Approve = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isApproved = req.body.isApproved;
  await user.save();
  res.json({ message: "User updated" });
};

//  Update user role

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const validRoles = ['user', 'admin'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid or missing role.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Role updated.', user });
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
