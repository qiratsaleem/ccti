import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Sidebar from "./Sidebar";
import "./UserManagement.css";

function UserManagement() {
  const { users, setUsers } = useContext(UserContext);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editUser, setEditUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    alert("User deleted successfully!");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditUser(users[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = () => {
    const updatedUsers = [...users];
    updatedUsers[editingIndex] = editUser;
    setUsers(updatedUsers);
    setEditingIndex(null);
    alert("User updated successfully!");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="user-management-page">
      <button className="back-arrow" onClick={() => navigate("/add-user")}>
        ←
      </button>
      <button className="sidebar-icon" onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="user-management-container">
        <h2 className="header">User Management</h2>
        {editingIndex !== null ? (
          <div className="edit-form">
            <h3>Edit User</h3>
            <form>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={editUser.username}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={editUser.firstName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={editUser.lastName}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Role:
                <input
                  type="text"
                  name="role"
                  value={editUser.role}
                  onChange={handleEditChange}
                />
              </label>
              <div className="action-buttons">
                <button type="button" className="edit-button" onClick={handleEditSave}>
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="action-buttons">
                    <button className="edit-button" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
