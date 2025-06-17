import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./home.css";


const Home = () => {
  const { isLoggedIn, id, name, email, role } = useSelector((state) => state.user);


  if (!isLoggedIn && !id) {
    return (
      <>
        <div className="home-page-wrapper">
          <div className="home-content-area unauthorized">
            <h2 className="main-message">
              Please log in to access the dashboard.
            </h2>
            <p className="sub-message">Your personalized content awaits!</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="home-page-wrapper">
        <div className="home-content-area authorized">
          {id ? (
            <>
              <h2 className="main-message">Welcome, {name}!</h2>
              <p className="sub-message">
                Here's a quick overview of your profile.
              </p>

              <div className="user-details-grid">
                <div className="detail-card">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{name}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{email}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">:-</span>
                  <span className="detail-value">Have a wonderful day!</span>
                </div>
              </div>
            </>
          ) : (
            <p className="loading-message">Loading user details...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
