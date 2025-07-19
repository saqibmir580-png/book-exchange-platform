const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createBlog, getBlogs } = require("../controllers/blogController");

router.post("/blogs", protect, createBlog);
router.get("/blogs", getBlogs);

module.exports = router;
