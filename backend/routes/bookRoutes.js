const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../utils/upload");
const { protect } = require("../middlewares/auth");

router.post("/add",protect, upload.single("image"), bookController.addBook);
router.get("/all", protect, bookController.getBooks);
router.get("/my", protect, bookController.getMyBooks);
router.put("/status", protect, bookController.updateBookStatus);
router.put("/:bookId", protect, bookController.updateBook);
router.delete("/:bookId", protect, bookController.deleteBook);
router.get("/:bookId", protect, bookController.getBookById);
router.get("/search/query", protect, bookController.searchBooks);
router.get("/filter/status", protect, bookController.getBooksByStatus);
router.get("/filter/author", protect, bookController.getBooksByAuthor);
router.get("/filter/title", protect, bookController.getBooksByTitle);
router.get("/filter/owner", protect, bookController.getBooksByOwnerId);

module.exports = router;
// This code defines the routes for book-related operations in a Node.js application using Express.
// It includes routes for adding a book, getting all books, getting a user's own books, updating book status,
// deleting a book, getting a book by ID, searching books, and filtering books by status, author, title, and owner ID.
// The routes are protected by authentication middleware, and file uploads for book images are handled using multer.
// Usage: This module can be imported in your main server file to set up the book-related routes.
// Example: const bookRoutes = require('./routes/bookRoutes'); to use these routes in your application.
// This code is part of a Node.js backend application that manages book-related operations.