// src/context/UserContext.js
import React, { createContext, useState } from "react";

// Create User Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
