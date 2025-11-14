const express = require("express");
const router = express.Router();
const Alumni = require("../models/Alumni");

// ✅ Get all users (optional filter: ?approved=true or false) page
router.get("/", async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};

    if (approved === "true") filter.approved = true;
    if (approved === "false") filter.approved = false;

    const users = await Alumni.find(filter).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// 🔍 Get only pending (unapproved) users
router.get("/pending-users", async (req, res) => {
  try {
    const pendingUsers = await Alumni.find({ approved: false }).select(
      "-password"
    );
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("❌ Error fetching pending users:", error);
    res.status(500).json({
      message: "Failed to fetch pending users",
      error: error.message,
    });
  }
});

// ✅ Approve user by ID
router.put("/approve/:id", async (req, res) => {
  try {
    const user = await Alumni.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "Alumni not found" });

    res.status(200).json({ message: "✅ Alumni approved successfully", user });
  } catch (error) {
    console.error("❌ Error approving user:", error);
    res.status(500).json({
      message: "Failed to approve user",
      error: error.message,
    });
  }
});

// ❌ Delete user by ID
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const deleted = await Alumni.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Alumni not found" });

    res.status(200).json({ message: "🗑️ Alumni deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

module.exports = router;
