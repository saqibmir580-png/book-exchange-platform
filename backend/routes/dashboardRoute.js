const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashbaord");
const { protect } = require("../middlewares/auth");

router.get("/summary", protect, getDashboardSummary);

module.exports = router;
// This route will return the dashboard summary data including stats, chart data, and category data
// The `protect` middleware ensures that only authenticated users can access this route