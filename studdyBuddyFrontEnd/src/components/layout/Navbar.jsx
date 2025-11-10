import React from "react";
import Button from "../buttons/Button";
import "./layout.css";

const Navbar = ({ onLogout }) => (
  <nav className="navbar">
    <h2 className="logo">StudyBuddy</h2>
    <Button label="Add Course" size="small" />
    <Button
      label="Logout"
      size="small"
      variant="secondary"
      onClick={onLogout}
    />
  </nav>
);

export default Navbar;
