import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./AddAlumni.css";

const API_BASE = "http://localhost:5000";

const UpdateAlumni = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    course: "",
    company: "",
    designation: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {

    try {
      const res = await axios.get(`${API_BASE}/api/alumni/${id}`);
      const data = res.data;

      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        year: data.year,
        course: data.course,
        company: data.company,
        designation: data.designation,
        location: data.location,
      });

      if (data.photo) {
        setPreview(`${API_BASE}/uploads/${data.photo}`);
      }
    } catch (error) {
      console.error("Error fetching alumni", error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);
    if (photo) data.append("photo", photo);

    try {
      await axios.put(`${API_BASE}/api/alumni/${id}`, data);
      alert("✅ Profile updated successfully!");
      navigate("/alumni");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <div className="add-alumni-wrapper">
      <AdminHeader />

      <div className="add-alumni-container">
        <button className="back-btn" onClick={() => navigate("/alumni")}>
          ← Back
        </button>

        <h2>✏️ Update Profile</h2>

        <form onSubmit={handleSubmit} className="alumni-form">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Year of Passing"
          />
          <input
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Course / Department"
          />
          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
          />
          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "120px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
          )}

          <input type="file" onChange={handlePhotoChange} />

          <button type="submit">Update Profile</button>
        </form>
      </div>

      <AdminFooter />
    </div>
  );
};

export default UpdateAlumni;
