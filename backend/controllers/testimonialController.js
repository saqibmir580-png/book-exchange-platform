const Testimonial = require("../models/Testimonial");
const User = require("../models/User");

exports.createTestimonial = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name avatar role");
    if (!user) return res.status(404).json({ message: "User not found" });

    const testimonial = await Testimonial.create({
      user: req.user._id,
      name: user.name,
      role: user.role || "Reader", // fallback role
      avatar: user.avatar || "",   // optional
      message: req.body.message,
    });

    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit testimonial" });
  }
};


exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to load testimonials" });
  }
};
