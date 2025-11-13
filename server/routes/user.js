const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const Alumni = require("../models/Alumni");

// ✅ File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Try deleting from User collection
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) {
      return res.json({ message: "🗑️ Profile deleted successfully (User)" });
    }

    // If not in User, try deleting from Alumni
    const deletedAlumni = await Alumni.findByIdAndDelete(id);

    if (deletedAlumni) {
      return res.json({ message: "🗑️ Profile deleted successfully (Alumni)" });
    }

    // Neither found
    return res
      .status(404)
      .json({ message: "User not found in both collections" });
  } catch (error) {
    console.error("❌ Error deleting profile:", error);
    res.status(500).json({
      message: "❌ Failed to delete profile",
      error: error.message,
    });
  }
});

module.exports = router;
