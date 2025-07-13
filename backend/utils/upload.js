const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book-exchange/books",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 700, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
// This code sets up a file upload system using multer and Cloudinary.
// It configures multer to use Cloudinary as the storage backend, allowing image uploads to be stored in a specific folder
// with specified transformations (like resizing). The upload middleware can be used in routes to handle file uploads.
// Usage: This module can be imported in your route files to handle file uploads.
// Example: const upload = require('./utils/upload'); to use this upload middleware in your routes.