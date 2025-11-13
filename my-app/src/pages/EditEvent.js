import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./Events.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    message: "",
    createdBy: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing event by ID
  useEffect(() => {
    const fetchEventById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`
        );
        setEventData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
        setLoading(false);
      }
    };
    fetchEventById();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, {
        title: eventData.title,
        message: eventData.message,
      });
      alert("✅ Event updated successfully!");
      navigate("/events");
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event");
    }
  };

  if (loading) return <p>Loading event details...</p>;

  return (
    <>
      <AdminHeader />
      <main className="event-container">
        <h1>Edit Event</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleUpdate} className="event-form">
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
          />
          <textarea
            name="message"
            value={eventData.message}
            onChange={handleChange}
            placeholder="Event Description"
            required
          />
          <button type="submit">Update Event</button>
        </form>
      </main>
      <AdminFooter />
    </>
  );
};

export default EditEvent;
