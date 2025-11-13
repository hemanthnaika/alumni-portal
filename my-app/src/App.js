// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Admin Pages
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AddAlumni from "./pages/AddAlumni";
import AlumniPage from "./pages/AlumniPage";
import About from "./pages/About";
import Events from "./pages/Events";
import PendingApprovals from "./pages/PendingApprovals";
import BranchStats from "./pages/BranchStats";

// ✅ User Pages
import UserPage from "./pages/UserPage";
import UserHomePage from "./pages/UserHomePage";
import UserDashboard from "./pages/UserDashboard";
import UserEvents from "./pages/UserEvents";
import UpdateAlumni from "./pages/UpdateAlumni";
import EditEvent from "./pages/EditEvent";

const Fallback = ({ title }) => (
  <div style={{ textAlign: "center", paddingTop: "60px" }}>
    <h2>{title} Page Coming Soon 🚧</h2>
  </div>
);

function App() {
  return (
    <Routes>
      {/* 🔷 Admin Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-alumni" element={<AddAlumni />} />

      <Route path="/alumni" element={<AlumniPage />} />
      <Route path="/branch-stats" element={<BranchStats />} />
      <Route path="/pending-users" element={<PendingApprovals />} />
      <Route path="/about" element={<About />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EditEvent />} />
      <Route path="/edit-profile/:id" element={<UpdateAlumni />} />

      {/* 🔷 User Routes */}
      <Route path="/user" element={<UserPage />} />
      <Route path="/user-home" element={<UserHomePage />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-events" element={<UserEvents />} />

      {/* 🔁 Redirects */}
      <Route path="/login" element={<Navigate to="/user" replace />} />
      <Route path="/register" element={<Navigate to="/user" replace />} />

      {/* 🚫 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              padding: "2rem",
              color: "red",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
