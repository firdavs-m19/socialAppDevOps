import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function
  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      inputs
    );

    // Save user and token separately
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    setCurrentUser(res.data.user);
  };

  // Logout function
  const logout = () => {
    // Remove user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Set currentUser state to null
    setCurrentUser(null);
  };

  // Sync currentUser with localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
