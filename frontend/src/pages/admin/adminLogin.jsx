import React, { useState } from "react";
import axios from "axios";
import "./adminLogin.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../../redux/slices/userSlice";
import { adminLogin } from "../../services/userServices";

const AdminLogin = () => {
  const authUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, user } = await adminLogin(formData);
      
      toast.success("Admin login successful!");

      if (user.isAdmin) {
        dispatch(
          setUser({
            id: user._id,
            name: user.name,
            email: user.email,
            role: "admin",
            token: token,
          })
        );
      }

      navigate("/admin");
    } catch (err) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError(err.response?.data?.message || "Login failed");
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container dark-theme">
      <div className="admin-login-card dark-card">
        <h2 className="admin-login-title dark-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label dark-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input dark-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label dark-label">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input dark-input"
            />
          </div>
          {error && <p className="error-message dark-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`login-button red-button ${loading ? "loading" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
