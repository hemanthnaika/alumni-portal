import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./AlumniPage.css";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [selectedAlum, setSelectedAlum] = useState(null);
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAllAlumni();
  }, []);

  // ✅ Fetch all alumni (Admin-added + Approved Users)
  // ✅ Fetch all alumni (Admin-added + Approved Users)
  const fetchAllAlumni = async () => {
    try {
      const [adminRes, approvedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/alumni"),
        axios.get("http://localhost:5000/api/auth/approved"),
      ]);

      const combined = [...adminRes.data, ...approvedRes.data];

      // ✅ Remove duplicates — prefer unique email, fallback to _id
      const uniqueAlumni = Object.values(
        combined.reduce((acc, alum) => {
          const key = alum.email || alum._id; // email is global unique field
          if (!acc[key]) acc[key] = alum;
          return acc;
        }, {})
      );

      setAlumni(uniqueAlumni);
    } catch (error) {
      console.error("❌ Failed to load alumni data:", error);
    }
  };

  // ✅ Delete own profile
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      alert("Profile deleted successfully!");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("❌ Failed to delete profile:", error);
    }
  };

  // ✅ Helper for images
  const getPhotoUrl = (photo) =>
    photo
      ? `http://localhost:5000/uploads/${photo}`
      : "https://via.placeholder.com/400x200?text=No+Image";

  // ✅ Group alumni by branch/course
  const groupedAlumni = alumni.reduce((groups, alum) => {
    const course = alum.course || "Others";
    if (!groups[course]) groups[course] = [];
    groups[course].push(alum);
    return groups;
  }, {});

  return (
    <>
      <AdminHeader />
      <main className="alumni-content">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1 className="alumni-heading">🎓 Alumni Directory</h1>

        {alumni.length === 0 ? (
          <p className="no-alumni">No alumni found.</p>
        ) : (
          <div className="alumni-container">
            {/* Sidebar grouped by course */}
            <aside className="alumni-list">
              {Object.keys(groupedAlumni).map((course) => (
                <div key={course} className="branch-section">
                  <h3 style={{ textAlign: "center" }}>{course}</h3>
                  {groupedAlumni[course].map((alum) => (
                    <div
                      key={alum._id}
                      className={`alumni-name ${
                        selectedAlum?._id === alum._id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAlum(alum)}
                    >
                      {alum.name}
                    </div>
                  ))}
                </div>
              ))}
            </aside>

            {/* Details section */}
            <section className="alumni-details">
              {selectedAlum ? (
                <div className="alumni-card">
                  <img
                    src={getPhotoUrl(selectedAlum.photo)}
                    alt={selectedAlum.name}
                    className="alumni-photo"
                  />
                  <h2>{selectedAlum.name}</h2>
                  <p>
                    <strong>Batch:</strong> {selectedAlum.year || "-"}
                  </p>
                  <p>
                    <strong>Course:</strong> {selectedAlum.course || "-"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedAlum.email || "-"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedAlum.phone || "-"}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedAlum.company || "-"}
                  </p>
                  <p>
                    <strong>Designation:</strong>{" "}
                    {selectedAlum.designation || "-"}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedAlum.location || "-"}
                  </p>

                  {/* Show edit/delete if own profile */}
                  {/* {loggedUser && selectedAlum._id === loggedUser._id && ( */}
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-profile/${selectedAlum._id}`)
                      }
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(selectedAlum._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  {/* )} */}
                </div>
              ) : (
                <div className="alumni-placeholder">
                  <p>Select an alumni to view details</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <AdminFooter />
    </>
  );
};

export default AlumniPage;
