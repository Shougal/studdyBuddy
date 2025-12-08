import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";
import api from "../../services/api";

const UVA_NAVY = "#232D4B";
const UVA_ORANGE = "#E57200";

const Navbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const toast = useToast();

  if (!user) return null;

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch {}
    toast.info("Logged out successfully");
    onLogout();
    navigate("/");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 32px",
      background: UVA_NAVY,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>
      <Link to="/" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", textDecoration: "none", letterSpacing: "-0.5px" }}>
        StudyBuddy
      </Link>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.8)", marginRight: "8px" }}>
          {user.name || user.computingID}
        </span>
        
        <Link to="/schedule"><button style={navBtn}>My Courses</button></Link>
        <Link to="/groups"><button style={navBtn}>Find Groups</button></Link>
        <Link to="/create-group"><button style={{...navBtn, background: UVA_ORANGE}}>Create Group</button></Link>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </nav>
  );
};

const navBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: "6px",
  background: "#fff",
  color: "#232D4B",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s"
};

export default Navbar;