// routes/alumni.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  register,
  login,
  getAll,
  getApproved,
  update,
  remove,
  getById,
  branchStats,
} = require("../controllers/alumniController");

// -------------- MULTER UPLOAD ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Allow only MBA & MCA
const validateBranch = (req, res, next) => {
  const allowed = ["MBA", "MCA"];
  const branch = req.body.course;
  if (branch && !allowed.includes(branch))
    return res.status(400).json({ message: "Only MBA/MCA allowed" });
  next();
};

// ---------------- ROUTES ----------------

// Register
router.post("/register", upload.single("photo"), validateBranch, register);

// Login
router.post("/login", login);

// All alumni (admin)
router.get("/", getAll);

// Approved alumni (for directory)
router.get("/approved", getApproved);

// Update alumni
router.put("/:id", upload.single("photo"), validateBranch, update);

// Delete alumni
router.delete("/:id", remove);

// Get single
router.get("/single/:id", getById);

// Stats
router.get("/branch-stats", branchStats);

module.exports = router;
