const express = require("express");
const router = express.Router();
const {
  AddBook,
  AddBulkUpload,
  getBooks,
  getMyBooks,
  updateBookStatus,
  updateBook,
  deleteBook,
  getBookById,
} = require("../controllers/bookController");

const { protect } = require("../middlewares/auth");
const { uploadImage, uploadExcel } = require("../utils/upload");

router.post("/add", protect, uploadImage.single("image"), AddBook);
router.post("/bulk-upload", protect, uploadExcel.single("file"), AddBulkUpload);
router.get("/all", protect, getBooks);
router.get("/my", protect, getMyBooks);
router.put("/status", protect, updateBookStatus);
router.put("/:bookId", protect, updateBook);
router.delete("/:bookId", protect, deleteBook);
router.get("/:bookId", protect, getBookById);

module.exports = router;
// This code defines the routes for book-related operations in a Node.js application using Express.
// It includes routes for adding a book, getting all books, getting a user's own books, updating book status,
// deleting a book, getting a book by ID, searching books, and filtering books by status, author, title, and owner ID.
// The routes are protected by authentication middleware, and file uploads for book images are handled using multer.
// Usage: This module can be imported in your main server file to set up the book-related routes.
// Example: const bookRoutes = require('./routes/bookRoutes'); to use these routes in your application.
// This code is part of a Node.js backend application that manages book-related operations.
