import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../redux/slices/userSlice";
import { updateUserProfile } from "../../services/userServices";
import "./profile.css";
import Avatar from "../../components/Avatar/Avatar";

const Profile = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, id, name, email, role, token, avatar } = useSelector(
    (state) => state.user
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    if (isLoggedIn && name && email) {
      setFormData({ name, email, avatar: null });
    }
    setLoading(false);
  }, [isLoggedIn, name, email]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setFormData({ name, email, avatar: null });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email cannot be empty.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }

    try {
      const response = await updateUserProfile(data);

      if (response.message === "User updated successfully.") {
        dispatch(
          setUser({
            id,
            name: formData.name,
            email: formData.email,
            role,
            token,
            isAdmin: role,
            isLoggedIn: true,
            avatar: response.avatar,
          })
        );
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Failed to update user data:", err);
      setError("Failed to update profile. Please try again.");
      toast.error(err.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>No user data available.</p>
        </div>
      </div>
    );
  }

  const isAdminUser = role === "admin";

  return (
    <div className={`profile-page ${isAdminUser ? "admin-theme" : ""}`}>
      <div className="profile-container">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-card">
          <div className="profile-avatar-large">
            <Avatar name={name} avatar={avatar} />
          </div>

          {!isEditing ? (
            <div className="profile-details-view">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{role}</span>
              </div>
              <button className="edit-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form className="profile-details-form" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="avatar">Upload Avatar:</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
