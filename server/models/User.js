// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  year: String,
  course: String,
  company: String,
  designation: String,
  location: String,
  photo: String,
  approved: { type: Boolean, default: false } // Must be approved by admin
});

module.exports = mongoose.model("User", userSchema);
