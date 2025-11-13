// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getApprovedUsers,
} = require("../controllers/authController");

// 📸 Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Middleware to restrict branch selection to MBA/MCA only
const validateBranch = (req, res, next) => {
  const allowedBranches = ["MBA", "MCA"];
  const branch =
    req.body.branch || (req.body && req.body.get && req.body.get("branch"));
  if (branch && !allowedBranches.includes(branch)) {
    return res.status(400).json({
      message: "Invalid branch. Only MBA and MCA registrations are allowed.",
    });
  }
  next();
};

// ✅ Register user (requires admin approval)
router.post("/register", upload.single("photo"), validateBranch, registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Get all users (admin)
router.get("/", getAllUsers);

// ✅ Get only approved alumni (for alumni directory)
router.get("/approved", getApprovedUsers);

// ✅ Update (approve/edit)
router.put("/:id", upload.single("photo"), validateBranch, updateUser);

// ✅ Delete user
router.delete("/:id", deleteUser);

module.exports = router;
