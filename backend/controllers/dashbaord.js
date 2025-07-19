const Book = require("../models/Book");
const User = require("../models/User");
const Order = require("../models/Order"); 

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const booksUploaded = await Book.countDocuments({ ownerId: req.user._id });
    const booksOrdered = await Order.countDocuments({ fromUser: req.user._id }); 

    const chartData = [
      { name: "Jan", uploads: 2, orders: 1 },
      { name: "Feb", uploads: 3, orders: 2 },
      { name: "Mar", uploads: 5, orders: 3 },
      { name: "Apr", uploads: 6, orders: 4 },
      { name: "May", uploads: 8, orders: 5 },
      { name: "Jun", uploads: 7, orders: 6 },
      { name: "Jul", uploads: 12, orders: 8 },
    ];

    const categoryData = [
      { name: "available", value: await Book.countDocuments({ status: "available" }) },
      { name: "requested", value: await Book.countDocuments({ status: "requested" }) },
      { name: "exchanged", value: await Book.countDocuments({ status: "exchanged" }) },
      { name: "unavailable", value: await Book.countDocuments({ status: "unavailable" }) },
    ];

    res.json({
      stats: {
        totalBooks,
        booksUploaded,
        booksOrdered,
        membershipLevel: "Gold",
      },
      chartData,
      categoryData,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard data fetch failed" });
  }
};
