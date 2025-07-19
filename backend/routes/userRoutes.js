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

module.exports = router;
