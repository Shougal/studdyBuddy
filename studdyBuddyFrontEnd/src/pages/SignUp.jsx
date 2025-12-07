import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupRequest } from "../services/testAPI";

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
      // call shared axios helper
      const response = await signupRequest(form);
      const data = response.data;

      if (!data.ok) {
        setError(data.error || "Could not create account.");
      } else {
        setMessage("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
