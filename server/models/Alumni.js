// backend/models/Alumni.js
const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  year: String,
  course: String,
  company: String,
  designation: String,
  location: String,
  photo: String
});

module.exports = mongoose.model("Alumni", alumniSchema);
