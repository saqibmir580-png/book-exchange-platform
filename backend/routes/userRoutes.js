const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  logoutUser,
  sendOtp,
  verifyRegister,
} = require("../controllers/userController");

const { protect } = require("../middlewares/auth");
const { uploadImage } = require("../utils/upload");

router.post("/register", registerUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyRegister);
router.post("/login",loginUser);
router.post("/logout", logoutUser);
router.get("/get-profile", protect, getUserProfile);
router.put("/update-user-profile", uploadImage.single("avatar"), protect, updateUserProfile);
router.get("/all", protect, getAllUsers); 
// router.get('/:id', protect, getUserById); // Uncomment if you implement get user by ID
// router.delete('/:id', protect, deleteUser); // Uncomment if you implement delete user
// router.put('/:id', protect, updateUser); // Uncomment if you implement update user
// router.get('/membership-levels', protect, getMembershipLevels); // Uncomment if you implement get membership levels
// router.put('/membership-levels/:id', protect, updateMembershipLevel); // Uncomment if you implement update membership level
// router.get('/search', protect, searchUsers); // Uncomment if you implement search users

module.exports = router;
