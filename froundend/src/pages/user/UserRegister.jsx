import React, { useEffect, useState } from "react";
import "./userRegister.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../redux/slices/user1Slice";
import { registerUser } from "../../services/userServices";
import { toast } from "react-toastify";

const UserRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (
      updatedFormData.password &&
      updatedFormData.confirmPassword &&
      updatedFormData.password !== updatedFormData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  dispatch(registerStart());

  try {
    const data = await registerUser(formData);
    const user = data.user;

    dispatch(registerSuccess(user));
    dispatch(setUser({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
    }));

    toast.success("Registration successful!");
    navigate("/");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Registration failed");
    dispatch(registerFailure(err.response?.data?.message || "Registration failed"));
  }
};


  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h2 className="register-title">User Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-input"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="form-input"
          onChange={handleChange}
        />

        {error && <p className="error-message">{error}</p>}
        {passwordError && <p className="error-message">{passwordError}</p>}

        <button
          type="submit"
          className={`register-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
    
        <p className="register-link">
          Do you have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegister;
