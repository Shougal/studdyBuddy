import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/testAPI";

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
        // use the shared axios instance + helper
        const response = await loginRequest(computingID, password);
        const data = response.data;
  
        if (!data.ok) {
          // backend sends ok:false + error message for bad login
          setError(data.error || "Invalid computing ID or password.");
        } else {
          const user = data.user || { computingID }; // temp user object
          if (onLogin) onLogin(user);
          navigate("/"); // go to Home
        }
      } catch (err) {
        console.error(err);
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("Network error. Please try again.");
        }
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
