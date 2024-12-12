import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();
  const { users, setUsers } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    passkey: "",
    role: "user",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    setUsers([...users, formData]);
    alert("User added successfully!");
    navigate("/user-management"); // Navigate to User Management page
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleShareCredentials = () => {
    if (!shareEmail) {
      alert("Please enter an email address.");
      return;
    }
    alert(`Credentials shared with ${shareEmail}`);
    setIsModalOpen(false);
    setShareEmail("");
  };

  return (
    <div className="add-user-page">
      <button className="back-arrow" onClick={() => navigate("/admin-dashboard")}>
        ←
      </button>
      <button className="menu-icon" onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="add-user-container">
        <h2>Add New User</h2>
        <form className="user-form">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <label>Passkey</label>
          <input
            type="password"
            name="passkey"
            value={formData.passkey}
            onChange={handleChange}
            placeholder="Enter passkey"
          />
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <div className="button-group">
            <button type="button" className="add-user-button" onClick={handleAddUser}>
              Add User
            </button>
            <button
              type="button"
              className="share-credentials-button"
              onClick={() => setIsModalOpen(true)}
            >
              Share Credentials
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Share Credentials</h3>
            <label>Email Address</label>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Enter email to share credentials"
            />
            <div className="modal-buttons">
              <button onClick={handleShareCredentials}>Send</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUser;
