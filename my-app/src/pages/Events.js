import React, { useState, useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./Events.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [eventList, setEventList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();
      setEventList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Error fetching events");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          createdBy: "AdminUser", // Replace with real admin name or ID if available
        }),
      });

      if (!res.ok) throw new Error("Failed to post event");

      setTitle("");
      setMessage("");
      fetchEvents();
    } catch (err) {
      console.error("Error posting event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete your event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      alert("Event deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("❌ Failed to Event profile:", error);
    }
  };

  return (
    <>
      <AdminHeader />
      <main className="event-container">
        <h1>Post New Event</h1>

        <form onSubmit={handleSubmit} className="event-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Event Description"
            required
          />
          <button type="submit">Post Event</button>
        </form>

        <div className="event-list">
          {error && <p className="error">{error}</p>}
          {eventList.map((event) => (
            <div key={event._id} className="event-item">
              <h3>{event.title}</h3>
              <p>{event.message}</p>
              <small>
                By {event.createdBy} on{" "}
                {new Date(event.createdAt).toLocaleString()}
              </small>
              <div className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <AdminFooter />
    </>
  );
};

export default Events;
