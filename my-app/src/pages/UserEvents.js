import React, { useEffect, useState } from 'react';
import './Events.css';

const UserEvents = () => {
  const [eventList, setEventList] = useState([]);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      setEventList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Error loading events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="event-container">
      <h1>Upcoming Events</h1>
      {error && <p className="error">{error}</p>}
      {eventList.length === 0 && !error && <p>No upcoming events.</p>}
      {eventList.map((event) => (
        <div key={event._id} className="event-item">
          <h3>{event.title}</h3>
          <p>{event.message}</p>
          <small>By {event.createdBy} on {new Date(event.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default UserEvents;
