// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Static credentials
  const STATIC_USERNAME = "admin";
  const STATIC_PASSWORD = "password123";

  const handleLogin = () => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      navigate("/admin-dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src="/path/to/logo.png" alt="CCTI System" />
        <h2>CCTI SYSTEM</h2>
      </div>
      <h2>Log in to your account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
