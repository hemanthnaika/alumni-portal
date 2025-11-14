import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PendingApprovals.css";

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Fetch pending users awaiting approval
  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/pending-users"
      );
      setPendingUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch pending users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Approve a pending user
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      alert("✅ User approved successfully!");
    } catch (err) {
      console.error("❌ Approval failed:", err.message);
      alert("Approval failed. Try again.");
    }
  };

  // 🔹 Delete a pending user
  const handleDelete = async (id, e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user._id !== id));
      alert("🗑️ User deleted successfully!");
    } catch (err) {
      console.error("❌ Deletion failed:", err.message);
      alert("Deletion failed. Try again.");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="pending-approvals-container">
      {/* Header */}
      <div className="header-section">
        <h2>🕓 Pending User Approvals</h2>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Loading or content */}
      {loading ? (
        <p>Loading pending users...</p>
      ) : pendingUsers.length === 0 ? (
        <p>No pending users found.</p>
      ) : (
        <div className="user-cards">
          {pendingUsers.map((user) => (
            <div className="user-card" key={user._id}>
              <img
                src={
                  user.photo
                    ? `http://localhost:5000/uploads/${user.photo}`
                    : "https://via.placeholder.com/150?text=No+Image"
                }
                alt={user.name}
                className="user-photo"
              />
              <h3>{user.name}</h3>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "N/A"}
              </p>
              <p>
                <strong>Batch:</strong> {user.year || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {user.course || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {user.company || "N/A"}
              </p>
              <p>
                <strong>Position:</strong> {user.designation || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {user.location || "N/A"}
              </p>

              <div className="button-group">
                <button
                  className="approve-btn"
                  onClick={() => handleApprove(user._id)}
                >
                  ✅ Approve
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
