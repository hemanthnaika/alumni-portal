const Alumni = require("../models/Alumni");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ---------------------- REGISTER ----------------------
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      year,
      course,
      password,
      company,
      designation,
      location,
    } = req.body;

    const exists = await Alumni.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new Alumni({
      name,
      email,
      phone,
      year,
      course,
      company,
      designation,
      location,
      photo: req.file ? req.file.filename : null,
      password: hashed,
      approved: false,
    });

    await newUser.save();
    res.json({ message: "Registered successfully. Wait for admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ---------------------- LOGIN ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Alumni.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.approved)
      return res.status(400).json({ message: "Not approved by admin yet" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, "secret123");

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

// ---------------------- GET ALL ----------------------
exports.getAll = async (req, res) => {
  try {
    const data = await Alumni.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alumni" });
  }
};

// ---------------------- GET APPROVED ----------------------
exports.getApproved = async (req, res) => {
  try {
    const data = await Alumni.find({ approved: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching approved alumni" });
  }
};

// ---------------------- UPDATE ----------------------
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    let updated = { ...req.body };

    // 📌 If new photo uploaded → update photo
    if (req.file) {
      updated.photo = req.file.filename;
    }

    // 📌 If password is provided → hash and update
    if (req.body.password) {
      updated.password = await bcrypt.hash(req.body.password, 10);
    } else {
      // ❗ Prevent overwriting password with empty string
      delete updated.password;
    }

    const result = await Alumni.findByIdAndUpdate(id, updated, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.json({
      message: "Updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ---------------------- DELETE ----------------------
exports.remove = async (req, res) => {
  try {
    await Alumni.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ---------------------- SINGLE GET ----------------------
exports.getById = async (req, res) => {
  try {
    const data = await Alumni.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alumni" });
  }
};

// ---------------------- STATS (Branch + Year) ----------------------
exports.branchStats = async (req, res) => {
  try {
    const stats = await Alumni.aggregate([
      {
        $group: {
          _id: { batch: "$year", branch: "$course" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
