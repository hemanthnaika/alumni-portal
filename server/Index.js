// backend/index.js
// Update
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// ✅ CORS setup (allow frontend)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Serve uploaded photos statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/alumnihub")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import and mount routes

const alumniRoutes = require("./routes/alumni");
const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/events");

app.use("/api/alumni", alumniRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

// ✅ Default root route
app.get("/", (req, res) => {
  res.send("🎓 Alumni Portal Backend Running Successfully...");
});

// ✅ Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
