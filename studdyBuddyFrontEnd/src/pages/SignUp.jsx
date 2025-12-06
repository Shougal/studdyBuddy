import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    computingID: "",
    name: "",
    year: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      // For now: just log it so the page works
      console.log("Sign-up form submitted:", form);

      // 🔜 When your friend’s API is ready, you’ll replace the log with:
      //
      // const response = await fetch("http://localhost/studdyBuddy/api/users", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     computingID: form.computingID,
      //     name: form.name,
      //     year: Number(form.year),
      //     password: form.password,
      //   }),
      // });
      // const data = await response.json();
      // if (!response.ok || data.error) {
      //   setError(data.error || "Could not create account.");
      //   return;
      // }

      setMessage("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="page"
      style={{ maxWidth: 500, margin: "0 auto", padding: "2rem" }}
    >
      <h2>Sign Up</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <label>
          Computing ID
          <input
            type="text"
            name="computingID"
            value={form.computingID}
            onChange={handleChange}
            placeholder="abc1d"
            required
          />
        </label>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Anna Will"
            required
          />
        </label>

        <label>
          Year
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="3"
            min="1"
            max="4"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "0.75rem" }}>{error}</p>
      )}
      {message && (
        <p style={{ color: "green", marginTop: "0.75rem" }}>{message}</p>
      )}
    </div>
  );
};

export default SignUp;
