import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Ensure Sidebar is imported
import "./AddUser.css";

function AddUser() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleBackClick = () => {
    navigate("/admin-dashboard");
  };

  const handleAddUser = () => {
    alert("User added successfully!");
  };

  const handleShareCredentials = () => {
    setIsModalOpen(true);
  };

  const handleSendCredentials = () => {
    alert(`Credentials sent to ${email}`);
    setIsModalOpen(false);
  };

  return (
    <div className="add-user-page">
      <Sidebar /> {/* Sidebar added to keep it visible */}
      <button className="back-button" onClick={handleBackClick}>←</button>
      <div className="add-user-container">
        <div className="logo">CCTI System</div>
        <form className="user-form">
          <label>Username</label>
          <input type="text" placeholder="Enter username" />
          <label>First Name</label>
          <input type="text" placeholder="Enter first name" />
          <label>Last Name</label>
          <input type="text" placeholder="Enter last name" />
          <label>Email</label>
          <input type="email" placeholder="Enter email" />
          <label>Passkey</label>
          <input type="password" placeholder="Enter passkey" />
          <label>Role</label>
          <select>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <div className="button-group">
            <button type="button" className="add-user-button" onClick={handleAddUser}>
              Add User
            </button>
            <button type="button" className="share-credentials-button" onClick={handleShareCredentials}>
              Share Credentials
            </button>
          </div>
        </form>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Share Credentials</h2>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to send credentials"
            style={{ marginBottom: "1em" }} // Spacing added here
          />
          <button onClick={handleSendCredentials}>Send</button>
        </Modal>
      </div>
    </div>
  );
}

export default AddUser;
