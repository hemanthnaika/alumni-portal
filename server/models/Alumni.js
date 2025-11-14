// models/Alumni.js
const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  year: String,
  course: String, // MBA / MCA
  company: String,
  designation: String,
  location: String,
  photo: String,

  // Auth fields
  password: String,
  approved: { type: Boolean, default: false }, // admin approves
  role: { type: String, default: "alumni" }, // admin / alumni
});

module.exports = mongoose.model("Alumni", alumniSchema);
