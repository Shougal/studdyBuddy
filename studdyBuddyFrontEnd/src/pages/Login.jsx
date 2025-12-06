import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [computingID, setComputingID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost/studdyBuddy/api/login",
        {
          computingID,
          password,
        },
        {
          withCredentials: true, // allow PHP sessions
        }
      );

      const data = response.data;

      // Backend: { ok: true, msg: ... }
      if (!data.ok) {
        setError(data.error || "Invalid computing ID or password.");
        return;
      }

      // Login successful!
      const user = { computingID };

      if (onLogin) onLogin(user);

      navigate("/"); // home
    } catch (err) {
      console.error(err);
      setError("Network error or invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Log In</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}
      >
        <label>
          Computing ID
          <input
            type="text"
            value={computingID}
            onChange={(e) => setComputingID(e.target.value)}
            placeholder="abc1d"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "0.75rem" }}>{error}</p>
      )}
    </div>
  );
};

export default Login;
