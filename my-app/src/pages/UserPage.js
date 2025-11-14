import React, { useState } from "react";
import axios from "axios";
import "./UserPage.css";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    course: "",
    company: "",
    designation: "",
    location: "",
    password: "",
    photo: null,
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSuccessMsg("");
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      if (files[0] && files[0].type.startsWith("image/")) {
        setRegisterData({ ...registerData, photo: files[0] });
      } else {
        alert("Please upload a valid image file");
      }
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/alumni/login",
        loginData
      );

      if (!res.data.user.approved) {
        alert("Your registration is pending admin approval.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/user-home");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(registerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post("http://localhost:5000/api/alumni/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg(
        "✅ Thank you for registering! Your account is pending approval. You will be able to log in once approved."
      );
      setTimeout(() => {
        setIsLogin(true);
        setSuccessMsg("");
        navigate("/user"); // redirects to login view
      }, 3000);
    } catch (err) {
      alert(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-auth-container">
      <div className="auth-box">
        <h2>
          {isLogin ? "Welcome Back! Please Login" : "Join Our Alumni Network"}
        </h2>

        {successMsg && (
          <p style={{ color: "green", fontWeight: "bold" }}>{successMsg}</p>
        )}

        {isLogin ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="toggle-text">
              Don’t have an account? <span onClick={toggleForm}>Sign up</span>
            </p>
          </form>
        ) : (
          <form
            className="auth-form"
            onSubmit={handleRegisterSubmit}
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleRegisterChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleRegisterChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              onChange={handleRegisterChange}
              required
            />
            <input
              type="text"
              name="year"
              placeholder="Batch (e.g. 2020-2024)"
              onChange={handleRegisterChange}
              required
            />

            {/* ✅ Only MBA and MCA branches */}
            <select
              name="course"
              value={registerData.course}
              onChange={handleRegisterChange}
              required
            >
              <option value="">Select Branch</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
            </select>

            <input
              type="text"
              name="company"
              placeholder="Current Company"
              value={registerData.company}
              onChange={handleRegisterChange}
            />
            <input
              type="text"
              name="designation"
              placeholder="Current Position"
              onChange={handleRegisterChange}
              value={registerData.designation}
            />
            <input
              type="text"
              name="location"
              placeholder="Location (City, Country)"
              onChange={handleRegisterChange}
              value={registerData.location}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleRegisterChange}
              required
            />

            <label className="photo-label">Upload Your Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleRegisterChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="toggle-text">
              Already have an account? <span onClick={toggleForm}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserPage;
