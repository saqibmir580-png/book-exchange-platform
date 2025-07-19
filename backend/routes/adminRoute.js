const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/auth");
const {
  getAdminStats,
  getAllUsers,
  updateUserMembership,
  deleteUser,
  blockUser,
  getalltestimonials,
  toggleTestimonialVisibility,
  deleteTestimonial,
  Approve,
  updateUserRole,
} = require("../controllers/adminController");

router.get("/stats", protect, isAdmin, getAdminStats);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id/membership", protect, isAdmin, updateUserMembership);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.put("/users/:id/block", protect, isAdmin, blockUser);
router.put('/users/:id/approve', protect, isAdmin,Approve)
router.get("/testimonials", protect, isAdmin, getalltestimonials);
router.put(
  "/testimonials/:id/toggle",
  protect,
  isAdmin,
  toggleTestimonialVisibility
);
router.put(
  '/users/:id/role',
  protect,
  isAdmin,
  updateUserRole
);
router.delete("/testimonials/:id", protect, isAdmin, deleteTestimonial);

module.exports = router;
