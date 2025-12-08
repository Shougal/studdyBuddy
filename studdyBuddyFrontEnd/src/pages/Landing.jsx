import React from "react";
import { Link } from "react-router-dom";

const UVA_NAVY = "#232D4B";
const UVA_ORANGE = "#E57200";

const Landing = () => (
  <div style={{ textAlign: "center", paddingTop: "14vh", maxWidth: "540px", margin: "0 auto" }}>
    <h1 style={{ fontSize: "2.5rem", color: UVA_NAVY, marginBottom: "12px", fontWeight: 700 }}>
      StudyBuddy
    </h1>
    <p style={{ fontSize: "1.1rem", color: "#6c757d", marginBottom: "40px", lineHeight: 1.6 }}>
      Find and create study groups for your UVA courses.<br />
      Collaborate with classmates. Succeed together.
    </p>
    <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
      <Link to="/login">
        <button style={{ padding: "14px 40px", fontSize: "1rem", background: UVA_NAVY, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
          Log In
        </button>
      </Link>
      <Link to="/signup">
        <button style={{ padding: "14px 40px", fontSize: "1rem", background: UVA_ORANGE, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
          Sign Up
        </button>
      </Link>
    </div>
    <p style={{ marginTop: "80px", color: "#adb5bd", fontSize: "0.9rem" }}>
      University of Virginia · CS4750
    </p>
  </div>
);

export default Landing;