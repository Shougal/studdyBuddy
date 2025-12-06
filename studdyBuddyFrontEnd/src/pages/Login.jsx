import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      // 🔴 TODO: confirm the actual backend URL with your friend
      // If using XAMPP + PHP, it might be something like:
      // "http://localhost/studdyBuddy/pages/login.php"
      const response = await fetch("/pages/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          computingID,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error) {
        setError(data.error || "Invalid computing ID or password.");
      } else {
        // Example: backend returns { user: {...} }
        const user = data.user || { computingID };

        // save in parent state (and maybe localStorage if you want)
        if (onLogin) {
          onLogin(user);
        }

        navigate("/"); // go to Home/My Courses
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Log In</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
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
        <p style={{ color: "red", marginTop: "0.75rem" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
