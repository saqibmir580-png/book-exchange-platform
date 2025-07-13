const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const {
  createTestimonial,
  getAllTestimonials,
} = require("../controllers/testimonialController");

router.post("/", protect, createTestimonial); 
router.get("/", getAllTestimonials);          

module.exports = router;
