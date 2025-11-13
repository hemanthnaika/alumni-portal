const express = require("express");
const router = express.Router();
const multer = require("multer");
const { registerUser, loginUser } = require("../controllers/authController");

// photo upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);

module.exports = router;
