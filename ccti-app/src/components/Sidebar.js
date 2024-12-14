// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import admin from "./admin.jfif";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [showTIPlatforms, setShowTIPlatforms] = useState(false); // Manage state for TI Platforms screen

  const role = localStorage.getItem("role") || "user";

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleTIPlatforms = () => {
    setShowTIPlatforms(!showTIPlatforms); // Toggle the state for TI Platforms
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="close-button" onClick={onClose}>
        &times;
      </div>

      {showTIPlatforms ? (
        <div className="ti-platforms-section">
          {/* Back Arrow */}
          <div className="back-arrow" onClick={toggleTIPlatforms}>
            &larr; 
          </div>
          <h3>Live View of TI Platforms</h3>
          <ul className="platform-list">
            {Array.from({ length: 10 }).map((_, index) => (
              <li key={index}>
                Platform {index + 1}{" "}
                <span className={`status ${index < 5 ? "connected" : "not-connected"}`}>
                  {index < 5 ? "Connected" : "Not Connected"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {role === "admin" && (
            <div className="admin-section">
              <img src={admin} alt="Admin" className="admin-picture" />
              <p className="admin-name">Admin Name</p>
            </div>
          )}

          <nav>
            {role === "admin" && (
              <>
                <Link to="/add-user" className="menu-item" onClick={onClose}>
                  Add User
                </Link>
                <Link to="/user-management" className="menu-item" onClick={onClose}>
                  User Management
                </Link>
              </>
            )}
          </nav>

          <div className="connectivity-section">
            <h3>Connectivity</h3>
            <ul>
              <li>Log Source <span className="tick">✔</span></li>
              <li>RDS <span className="tick">✔</span></li>
              <li>Network Controller <span className="tick">✔</span></li>
              <li onClick={toggleTIPlatforms} className="ti-platforms clickable">
                TI Platforms <span className="tick">✔</span>
              </li>
            </ul>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
