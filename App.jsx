import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Auth onLogin={login} />} />
      <Route path="/" element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} />
    </Routes>
  );
}
