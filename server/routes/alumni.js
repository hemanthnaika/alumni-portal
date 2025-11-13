// backend/routes/alumni.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Alumni = require("../models/Alumni");
const User = require("../models/User"); // 👈 Import User model

// ✅ File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ➕ Add Alumni (Admin-only action)
router.post("/add", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, phone, year, course, company, designation, location } =
      req.body;

    const newAlumni = new Alumni({
      name,
      email,
      phone,
      year,
      course,
      company,
      designation,
      location,
      photo: req.file ? req.file.filename : null,
    });

    await newAlumni.save();
    res.status(201).json({ message: "✅ Alumni added successfully" });
  } catch (error) {
    console.error("Error adding alumni:", error);
    res.status(500).json({ message: "❌ Error adding alumni" });
  }
});

// 📜 Get all alumni (Admin-added + Approved Users)
router.get("/", async (req, res) => {
  try {
    const alumniFromAdmin = await Alumni.find();
    const approvedUsers = await User.find({ approved: true });

    // 🔗 Merge both lists
    const allAlumni = [...alumniFromAdmin, ...approvedUsers];

    if (!allAlumni.length)
      return res.status(404).json({ message: "No alumni found" });

    res.json(allAlumni);
  } catch (error) {
    console.error("❌ Error fetching alumni:", error);
    res.status(500).json({ message: "❌ Failed to fetch alumni" });
  }
});

// ✏️ Update alumni
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, year, course, company, designation, location } =
      req.body;

    const updatedData = {
      name,
      email,
      phone,
      year,
      course,
      company,
      designation,
      location,
    };

    if (req.file) updatedData.photo = req.file.filename;

    // Try updating Alumni
    let result = await Alumni.findByIdAndUpdate(id, updatedData, { new: true });

    // If not found in Alumni → update User
    if (!result) {
      result = await User.findByIdAndUpdate(id, updatedData, { new: true });
    }

    if (!result) {
      return res.status(404).json({ message: "User / Alumni not found" });
    }

    res.json({ message: "✅ Profile updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Failed to update profile" });
  }
});

// ❌ Delete alumni
router.delete("/:id", async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Alumni deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to delete alumni" });
  }
});

// 📊 Branch + Year Stats
router.get("/branch-stats", async (req, res) => {
  try {
    // ✅ Alumni added by admin
    const alumniFromAdmin = await Alumni.aggregate([
      {
        $group: {
          _id: { batch: "$year", branch: "$course" },
          count: { $sum: 1 },
        },
      },
    ]);

    // ✅ Approved student users (acting as alumni)
    const approvedUsers = await User.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: { batch: "$year", branch: "$course" },
          count: { $sum: 1 },
        },
      },
    ]);

    // ✅ Merge counts
    const merged = [...alumniFromAdmin, ...approvedUsers];

    // ✔️ Combine results by same year+branch
    const result = [];
    const map = new Map();

    merged.forEach((item) => {
      const key = `${item._id.batch}-${item._id.branch}`;
      if (!map.has(key)) {
        map.set(key, item);
      } else {
        map.get(key).count += item.count; // sum counts
      }
    });

    map.forEach((value) => result.push(value));

    res.json(result);
  } catch (err) {
    console.error("Error fetching branch stats:", err);
    res.status(500).json({ message: "Error fetching branch stats" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Request ID:", id);

    // Try Alumni collection
    let alum = await Alumni.findById(id);

    // If not found, try User collection (approved student alumni)
    if (!alum) {
      alum = await User.findById(id);
      if (!alum) return res.status(404).json({ message: "Not found" });
    }

    return res.json(alum);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error fetching alumni" });
  }
});

module.exports = router;
