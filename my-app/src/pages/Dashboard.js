import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [eventParticipation, setEventParticipation] = useState([]);

  const cards = [
    {
      title: "Add Alumni",
      description: "Create new alumni entries",
      path: "/add-alumni",
    },
    {
      title: "Alumni Directory",
      description: "View and explore alumni details",
      path: "/alumni",
    },
    {
      title: "Alumni Statistics",
      description: "View branch-wise alumni stats and charts",
      path: "/branch-stats", // ✅ Corrected
    },
    {
      title: "Pending Approvals",
      description: "Approve new user registrations",
      path: "/pending-users",
    },
  ];

  useEffect(() => {
    fetchParticipationData();
  }, []);

  const fetchParticipationData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEventParticipation(res.data);
    } catch (err) {
      console.error("❌ Error fetching participation data:", err);
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* 📦 Admin Cards */}
        <div className="dashboard-grid">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="dashboard-card"
              onClick={() => navigate(card.path)}
              role="button"
              tabIndex={0}
              aria-label={`Go to ${card.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(card.path);
              }}
            >
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        {/* 📋 Event Participation Section */}
        <section style={{ marginTop: "3rem" }}>
          <h2>📋 Event Participation Requests</h2>

          {eventParticipation.length === 0 ? (
            <p>No events found.</p>
          ) : (
            eventParticipation.map((event) => (
              <div key={event._id} className="event-card-admin">
                <h3>📅 {event.title}</h3>
                <p>{event.message}</p>
                <p>
                  <strong>Created By:</strong> {event.createdBy}
                </p>

                {event.raisedHands && event.raisedHands.length > 0 ? (
                  <ul className="raised-list">
                    {event.raisedHands.map((user) => (
                      <li key={user._id} className="raised-item">
                        <strong>{user.name}</strong> — {user.email} |{" "}
                        {user.branch} ({user.batch})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontStyle: "italic", color: "#888" }}>
                    No alumni have raised hands for this event.
                  </p>
                )}
              </div>
            ))
          )}
        </section>
      </main>
      <AdminFooter />
    </>
  );
};

export default Dashboard;
