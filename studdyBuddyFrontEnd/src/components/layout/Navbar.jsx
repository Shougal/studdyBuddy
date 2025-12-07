//navbar.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../buttons/Button";
import "./layout.css";
import api from "../../services/api";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  if (!user) return null;
  
  const handleLogout = async () => {
    try {
      await api.post("/users/logout");  
    } catch (err) {
      console.error("Logout failed:", err);
    }

    onLogout();      
    navigate("/", { replace: true });
  };
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        StudyBuddy
      </Link>

      <div className="nav-links">

        
        <Link to="/schedule">
          <Button label="My Courses" size="small" />
        </Link>

        <Link to="/groups">
          <Button label="Find Groups" size="small" />
        </Link>

        <Link to="/create-group">
          <Button label="Create Group" size="small" />
        </Link>

        <Button
          label="Logout"
          size="small"
          variant="secondary"
          onClick={handleLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
