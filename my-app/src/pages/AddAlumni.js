import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./AddAlumni.css";

const API_BASE = "http://localhost:5000";

const AddAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    course: "",
    company: "",
    designation: "",
    location: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/alumni`);

      // Backend returns { users, alumni }
      const all = res.data;

      setAlumni(all);
    } catch (err) {
      console.error("❌ Failed to fetch alumni:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);
    if (photo) data.append("photo", photo);

    try {
      await axios.post("http://localhost:5000/api/alumni/register", data);
      alert("✅ Alumni added!");
      fetchAlumni();
      setFormData({
        name: "",
        email: "",
        phone: "",
        year: "",
        course: "",
        company: "",
        designation: "",
        location: "",
        password: "",
      });
      setPhoto(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add alumni");
    }
  };

  return (
    <div className="add-alumni-wrapper">
      <AdminHeader />
      <div className="add-alumni-container">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        <h2>➕ Register New Alumni</h2>

        <form onSubmit={handleSubmit} className="alumni-form">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            name="year"
            placeholder="Year of Passing"
            value={formData.year}
            onChange={handleChange}
          />
          <input
            name="course"
            placeholder="Course / Department"
            value={formData.course}
            onChange={handleChange}
          />
          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />
          <input
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input type="file" onChange={handlePhotoChange} />
          <button type="submit">Register Alumni</button>
        </form>
      </div>

      <div className="all-alumni-section" style={{ margin: "20px" }}>
        <h3 style={{ color: "#1a73e8" }}>🎓 All Registered Alumni</h3>
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
                <strong>Branch:</strong> {alum.branch}
              </p>
              <p>
                <strong>Batch:</strong> {alum.batch}
              </p>
            </div>
          ))}
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AddAlumni;
