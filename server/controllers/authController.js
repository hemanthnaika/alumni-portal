const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Alumni = require("../models/Alumni");

// ✅ Register new user (pending admin approval)
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      batch,
      branch,
      company,
      position,
      location,
    } = req.body;

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists." });

    // ✅ Enforce MBA/MCA only (safety check)
    if (!["MBA", "MCA"].includes(branch)) {
      return res
        .status(400)
        .json({ message: "Invalid branch. Only MBA and MCA are allowed." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      year: batch,
      course: branch,
      company,
      designation: position,
      location,
      photo: req.file ? req.file.filename : null,
      approved: false, // Admin must approve before login
    });

    await newUser.save();
    res.status(201).json({
      message:
        "✅ Registration successful! Pending admin approval before login.",
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "❌ Server error during registration." });
  }
};

// ✅ Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found." });
    if (!user.approved)
      return res
        .status(403)
        .json({ message: "Awaiting admin approval before login." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ message: "✅ Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "❌ Server error during login." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const alumni = await Alumni.find();

    res.json({
      success: true,
      total: users.length + alumni.length,
      users,
      alumni,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "❌ Failed to fetch users." });
  }
};

// ✅ Get only approved users (for alumni directory)
exports.getApprovedUsers = async (req, res) => {
  try {
    const approved = await User.find({ approved: true });
    res.json(approved);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to fetch approved users." });
  }
};

// ✅ Update user (approve/edit)
exports.updateUser = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // Enforce MBA/MCA rule on update
    if (updatedData.branch && !["MBA", "MCA"].includes(updatedData.branch)) {
      return res
        .status(400)
        .json({ message: "Invalid branch. Only MBA and MCA are allowed." });
    }

    if (req.file) updatedData.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({
      message: "✅ User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "❌ Failed to update user." });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ User deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "❌ Failed to delete user." });
  }
};
