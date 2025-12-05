import React from "react";
import { Link } from "react-router-dom";
import Button from "../buttons/Button";
import "./layout.css";

const Navbar = ({ onLogout }) => {
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
          onClick={onLogout}
        />
      </div>
    </nav>
  );
};

export default Navbar;
