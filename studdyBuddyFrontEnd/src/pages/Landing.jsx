import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/buttons/Button";

const Landing = () => {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "12vh",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: "700",
          color: "#2967d1",
          marginBottom: "0.5rem",
        }}
      >
        Welcome to StudyBuddy
      </h1>

      <p
        style={{
          color: "#555",
          fontSize: "1rem",
          marginBottom: "2rem",
        }}
      >
        Your hub for courses, study groups, and collaboration.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link to="/login">
          <Button label="Log In" size="medium" />
        </Link>

        <Link to="/signup">
          <Button label="Sign Up" size="medium" variant="secondary" />
        </Link>
      </div>
    </div>
  );
};

export default Landing;
