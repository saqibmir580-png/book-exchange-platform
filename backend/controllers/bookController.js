const Book = require("../models/Book");

// Create new book with image
exports.addBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const image = req.file ? req.file.path : "";

    const book = await Book.create({
      title,
      author,
      ownerId: req.user._id,
      image,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message });
  }
};


// Get all books except user’s own
exports.getBooks = async (req, res) => {
  const books = await  Book.find().populate("ownerId", "name _id");
 
  res.json(books);
};
//  try {
//     const books = await Book.find().populate("ownerId", "name phone");
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch books" });
//   }

// Get books added by the current user
exports.getMyBooks = async (req, res) => {
  const books = await Book.find({ ownerId: req.user._id });
  res.json(books);
};
// controllers/bookController.js
exports.updateBook = async (req, res) => {
  const { bookId } = req.params;
  const { title, author } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  book.title = title || book.title;
  book.author = author || book.author;

  const updatedBook = await book.save();
  res.json(updatedBook);
};

// Update book status
exports.updateBookStatus = async (req, res) => {
  const { bookId, status } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own books" });
    }

    book.status = status;
    await book.save();

    res.json({ message: "✅ Book status updated", book });
  } catch (error) {
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};


// Delete a book
exports.deleteBook = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.ownerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own books" });
  }

  await book.deleteOne();
  res.json({ message: "Book deleted successfully" });
};

// Get book by ID
exports.getBookById = async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  res.json(book);
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get books by status
exports.getBooksByStatus = async (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ message: "Status query parameter is required" });
  }

  const books = await Book.find({ status, ownerId: { $ne: req.user._id } });
  res.json(books);
};

// Get books by author
exports.getBooksByAuthor = async (req, res) => {
  const { author } = req.query;
  if (!author) {
    return res.status(400).json({ message: "Author query parameter is required" });
  }

  const books = await Book.find({ author, ownerId: { $ne: req.user._id } });
  res.json(books);
};
// Get books by title
exports.getBooksByTitle = async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ message: "Title query parameter is required" });
  }

  const books = await Book.find({ title, ownerId: { $ne: req.user._id } });
  res.json(books);
};
// Get books by owner ID
exports.getBooksByOwnerId = async (req, res) => {
  const { ownerId } = req.query;
  if (!ownerId) {
    return res.status(400).json({ message: "Owner ID query parameter is required" });
  }

  const books = await Book.find({ ownerId, ownerId: { $ne: req.user._id } });
  res.json(books);
};
