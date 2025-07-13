// models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "requested", "exchanged", "unavailable"],
    default: "available",
  },
  image: {
    type: String, // This will store the path or URL of the image
    default: "",  // Optional default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", bookSchema);
// This code defines a Mongoose schema for a Book model in a Node.js application.
// The schema includes fields for title, author, ownerId (referencing a User), status (with predefined options),
// an optional image field to store the book's image URL or path, and a createdAt timestamp.
// The model is then exported for use in other parts of the application.
// Usage: This model can be used to create, read, update, and delete book records in a MongoDB database.
// Example: const Book = require('./models/Book'); to use this model in your application.
