import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./admin-dashboard.css";
import Navbar from "../admin/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllUsers, deleteUser, createUser, updateUser } from "../../services/userServices";

const AdminDashboard = () => {
  const { isLoggedIn, id, role, name, email } = useSelector((state) => state.user);

  const [allUsers, setAllUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
    } catch (err) {
      console.error("Failed to fetch all users:", err.response ? err.response.data : err.message);
      if (err.response && err.response.status === 403) {
        toast.error("You are not authorized to view user data.");
      } else {
        toast.error("Error fetching users. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && role === "admin") {
      fetchAllUsers();
      
    } else {
      setAllUsers([]);
      setShowUserForm(false);
      setEditingUser(null);
    }
  }, [isLoggedIn, role]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateNewUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", isAdmin: false });
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      isAdmin: user.isAdmin,
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (userIdToDelete) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this user?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={async () => {
                try {
                  await deleteUser(userIdToDelete);
                  toast.success("User deleted successfully!");
                  fetchAllUsers();
                } catch (err) {
                  console.error("Failed to delete user:", err.response ? err.response.data : err.message);
                  toast.error(`Failed to delete user: ${err.response?.data?.message || "Server error"}`);
                } finally {
                  closeToast();
                }
              }}
              style={{ padding: "5px 10px", backgroundColor: "#d9534f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
        };
        await updateUser(editingUser._id, updateData);
        toast.success("User updated successfully!");
      } else {
        await createUser(formData);
        toast.success("User created successfully!");
      }
      setShowUserForm(false);
      fetchAllUsers();
    } catch (err) {
      console.error("Failed to save user:", err.response ? err.response.data : err.message);
      toast.error(err.response?.data?.message || "Failed to save user. Please check console.");
    }
  };

  if (role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="admin-page-wrapper">
          <div className="admin-content-area unauthorized">
            <h2 className="admin-main-message">Access Denied.</h2>
            <p className="admin-sub-message">You do not have administrative privileges to view this dashboard.</p>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="admin-page-wrapper">
        <div className="admin-content-area authorized">
          <h2 className="admin-main-message">Admin Dashboard</h2>
          <p className="admin-sub-message">Manage users and system settings.</p>

          <div className="admin-summary-grid">
            <div className="admin-summary-card">
              <span className="summary-label">Total Users:</span>
              <span className="summary-value">{allUsers.length}</span>
            </div>
            <div className="admin-summary-card">
              <span className="summary-label">Admin Name:</span>
              <span className="summary-value">{name || "N/A"}</span>
            </div>
            <div className="admin-summary-card">
              <span className="summary-label">Logged In As:</span>
              <span className="summary-value">{email || "N/A"}</span>
            </div>
          </div>

          <div className="admin-actions-header">
            <h3 className="admin-section-title">All Users</h3>
            <div className="admin-actions-controls">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="create-user-btn" onClick={handleCreateNewUser}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Create New User
              </button>
            </div>
          </div>

          <div className="all-users-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="user-item-card">
                  <div className="user-details-group">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <span className={`user-role ${user.isAdmin ? "role-admin" : "role-user"}`}>
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                  <div className="user-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEditUser(user)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    {user._id !== id && (
                      <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3,6 5,6 21,6" />
                          <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-users-message">No users found.</p>
            )}
          </div>
        </div>
      </div>

      {showUserForm && (
        <div className="form-overlay">
          <div className="user-form-modal">
            <h3 className="form-title">{editingUser ? "Edit User" : "Create New User"}</h3>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required />
              </div>

              {!editingUser && (
                <>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="isAdmin" name="isAdmin" checked={formData.isAdmin} onChange={handleFormChange} />
                    <label htmlFor="isAdmin">Admin User</label>
                  </div>
                </>
              )}

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowUserForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminDashboard;
