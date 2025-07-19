const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    showOnHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
