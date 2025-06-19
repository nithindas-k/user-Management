import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { clearUser } from "../../redux/slices/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { isLoggedIn, role, name, email } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    navigate("/");
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getUserInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="nav-brand">
          <div className="company-logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M9 9h6v6h-6z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <span className="company-name">WEB-APP</span>
        </div>

        <div className="nav-center">
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Dashboard
            </Link>
            {role == "user" && isLoggedIn && (
              <Link to="/profile" className="nav-link">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Profile
              </Link>
            )}
          </div>
        </div>

        <div className="nav-right">
          {isLoggedIn && name ? (
            <div className="user-section">
              <div className="user-info">
                <span className="user-name">{name}</span>
                <span className="user-role">{role}</span>
              </div>

              <div className="user-menu-wrapper">
                <button className="user-menu-trigger" onClick={toggleUserMenu}>
                  <div className="user-avatar">
                    <span className="avatar-text">{getUserInitials(name)}</span>
                  </div>
                  <svg
                    className={`chevron-icon ${showUserMenu ? "rotated" : ""}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline
                      points="6,9 12,15 18,9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <div className="dropdown-avatar">
                          <span className="avatar-text">
                            {getUserInitials(name)}
                          </span>
                        </div>
                        <div className="dropdown-details">
                          <span className="dropdown-name">{name}</span>
                          <span className="dropdown-email">{email}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <polyline
                          points="16,17 21,12 16,7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <line
                          x1="21"
                          y1="12"
                          x2="9"
                          y2="12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <polyline
                  points="10,17 15,12 10,7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="15"
                  y1="12"
                  x2="3"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Sign In
            </Link>
          )}
        </div>
      </div>

      {showUserMenu && (
        <div className="overlay" onClick={() => setShowUserMenu(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;
