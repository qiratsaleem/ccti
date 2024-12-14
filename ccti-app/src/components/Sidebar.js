// src/components/Sidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css"; 

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  

  const role = localStorage.getItem("role") || "user"; 
  const handleLogout = () => {
    navigate("/login"); 
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="close-button" onClick={onClose}>&times;</div>
      
      {role === "admin" && (
        <div className="admin-section">
          <img src="admin-profile-pic.jpg" alt="Admin" className="admin-picture" />
          <p className="admin-name">Admin Name</p>
        </div>
      )}

      <nav>
        {role === "admin" && (
          <>
            <Link to="/add-user" className="menu-item" onClick={onClose}>Add User</Link>
            <Link to="/user-management" className="menu-item" onClick={onClose}>User Management</Link>
          </>
        )}
      </nav>

      <div className="connectivity-section">
        <h3>Connectivity</h3>
        <ul>
          <li>Log Source <span className="tick">✔</span></li>
          <li>RDS <span className="tick">✔</span></li>
          <li>Network Controller <span className="tick">✔</span></li>
          <li>TI Platforms <span className="tick">✔</span></li>
        </ul>
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Sidebar;
