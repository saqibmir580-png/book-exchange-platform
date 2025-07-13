const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  // Generate token
  const token = generateToken(user._id);

  // ✅ Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  // Respond with user details (optional)
  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    },
  });
};
// Logout
exports.logoutUser = (req, res) => {
  // Clear the token cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "Strict",
    maxAge: 0, // Expire immediately
  });

  res.status(200).json({ message: "Logout successful" });
};
// Get User Profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};
// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, password, pinCode, address, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  user.pinCode = pinCode || user.pinCode;
  user.address = address || user.address;
  user.phone = req.body.phone || user.phone;

  if (req.file && req.file.path) {
    user.avatar = req.file.path;
  }

  if (password) {
    const bcrypt = require("bcryptjs");
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    address: updatedUser.address,
    pinCode: updatedUser.pinCode,
    role: updatedUser.role,
    membershipLevel: updatedUser.membershipLevel,
    token: generateToken(updatedUser),
  });
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
// Get User by ID (Admin)
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
// Update User by ID (Admin)
exports.updateUserById = async (req, res) => {
  const { name, email, role, membershipLevel } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.membershipLevel = membershipLevel || user.membershipLevel;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    membershipLevel: updatedUser.membershipLevel,
  });
};
// Delete User by ID (Admin)
exports.deleteUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.remove();
  res.json({ message: "User removed successfully" });
};
