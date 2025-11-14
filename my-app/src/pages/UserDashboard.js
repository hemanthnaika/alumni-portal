import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import UserHeader from "../components/UserHeader";
import "./UserDashboard.css";

const API_BASE = "http://localhost:5000";

const UserDashboard = () => {
  const [alumni, setAlumni] = useState([]);
  const [user, setUser] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [raisingEventId, setRaisingEventId] = useState(null); // track in-flight action

  // Redirect if not logged in
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      if (parsed?._id) {
        fetchDashboardData(parsed._id);
      }
    } catch {
      window.location.href = "/";
    }
  }, []);

  // Fetch events on mount (and after hand raise)
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/events`);
      if (Array.isArray(res.data)) {
        setEventList(res.data);
      } else {
        setEventList([]);
      }
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Fetch user list (alumni)
  const fetchDashboardData = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/alumni`);
      setAlumni(res.data || []);
      const currentUser = (res.data || []).find((u) => u._id === userId);
      setUser((prev) => currentUser || prev);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // Raise hand for an event
  const handleRaiseHand = async (eventId) => {
    if (!user?._id) {
      alert("Please log in to respond to events.");
      return;
    }
    try {
      setRaisingEventId(eventId);
      const res = await axios.post(
        `${API_BASE}/api/events/${eventId}/raise-hand`,
        {
          userId: user._id,
        }
      );
      alert(res.data?.message || "Hand raised successfully!");
      await fetchEvents(); // refresh events to show updated status
    } catch (err) {
      console.error("❌ Error raising hand:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to raise hand.";
      alert(msg);
    } finally {
      setRaisingEventId(null);
    }
  };

  // Helper: has current user raised hand?
  const userHasRaisedHand = (event) =>
    Array.isArray(event?.raisedHands) && user?._id
      ? event.raisedHands.includes(user._id)
      : false;

  return (
    <div className="user-dashboard">
      <UserHeader />
      <div className="dashboard-content">
        <h2>🎓 User Dashboard</h2>

        <div className="dashboard-card">
          <h3>Total Registered Alumni</h3>
          <p className="count">{alumni.length}</p>
        </div>

        {user && (
          <div className="user-profile">
            <h3>Your Profile</h3>
            {user.photo && (
              <img
                src={`${API_BASE}/uploads/${user.photo}`}
                alt="Profile"
                className="profile-pic"
              />
            )}
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Batch:</strong> {user.year}
            </p>
            <p>
              <strong>Branch:</strong> {user.course}
            </p>
            <p>
              <strong>Company:</strong> {user.company}
            </p>
            <p>
              <strong>Position:</strong> {user.designation}
            </p>
            <p>
              <strong>Location:</strong> {user.location}
            </p>
          </div>
        )}

        <div className="all-alumni-section">
          <h3>All Registered Alumni</h3>
          <div className="alumni-grid">
            {alumni.map((alum) => (
              <div key={alum._id} className="alumni-card">
                {alum.photo && (
                  <img
                    src={`${API_BASE}/uploads/${alum.photo}`}
                    alt="Alumni"
                    className="alumni-pic"
                  />
                )}
                <p>
                  <strong>Name:</strong> {alum.name}
                </p>
                <p>
                  <strong>Branch:</strong> {alum.course}
                </p>
                <p>
                  <strong>Batch:</strong> {alum.year}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ EVENTS SECTION with Raise Hand */}
        <div id="events" className="event-section">
          <h3>📅 Alumni Events</h3>
          {eventList.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            <ul className="event-list">
              {eventList.map((event) => {
                const hasRaised = userHasRaisedHand(event);
                return (
                  <li key={event._id} className="event-item">
                    <p>{event.message}</p>
                    <small>
                      Posted on {new Date(event.createdAt).toLocaleString()}
                    </small>
                    <div style={{ marginTop: "0.5rem" }}>
                      {hasRaised ? (
                        <span
                          style={{
                            color: "green",
                            fontWeight: "bold",
                            padding: "0.25rem 0.5rem",
                            display: "inline-block",
                          }}
                        >
                          👍 Hand Raised
                        </span>
                      ) : (
                        <button
                          disabled={raisingEventId === event._id}
                          onClick={() => handleRaiseHand(event._id)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            backgroundColor:
                              raisingEventId === event._id ? "#999" : "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor:
                              raisingEventId === event._id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {raisingEventId === event._id
                            ? "Submitting..."
                            : "✋ Raise Hand"}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
