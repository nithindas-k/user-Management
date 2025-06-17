import React, { useState, useEffect, useRef } from "react";
import "./userLogin.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser, clearUser } from "../../redux/slices/userSlice";
import { loginUser } from "../../services/userServices";

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return false;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);

      const user = data.user;
      dispatch(
        setUser({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.isAdmin ? "admin" : "user",
          token: data.token,
        })
      );

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
      dispatch(clearUser());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">User Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          ref={inputRef}
          className="form-input"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          onChange={handleChange}
        />

        <button
          type="submit"
          className={`login-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register-link">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
