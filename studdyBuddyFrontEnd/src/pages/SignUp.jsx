import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const SignUp = () => {
  const [form, setForm] = useState({ computingID: "", name: "", year: "", password: "" });
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(pwd)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(pwd)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push("One special character");
    return errors;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setForm({ ...form, password: pwd });
    setPasswordErrors(validatePassword(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pwdErrors = validatePassword(form.password);
    if (pwdErrors.length > 0) {
      setError("Password does not meet requirements");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/users", { ...form, year: form.year ? Number(form.year) : null });
      console.log("SIGNUP RESPONSE:", res.data);

      if (res.data.ok) {
        toast.success("Account created! Please log in.");
        navigate("/login");
      } else {
        setError(res.data.error || "Could not create account");
      }
    } catch (err) {
      if (err.response?.data?.error?.includes("Duplicate")) {
        setError("This Computing ID is already registered");
      } else {
        setError(err.response?.data?.error || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = passwordErrors.length === 0 && form.password.length > 0;

  return (
    <div style={{ maxWidth: "380px", margin: "40px auto" }}>
      <h2 style={{ textAlign: "center", color: UVA_NAVY, marginBottom: "24px", fontWeight: 600 }}>Create Account</h2>
      
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {error && <div style={{ background: "#fee", color: "#c00", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem" }}>{error}</div>}
        
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Computing ID <span style={{ color: "#dc3545" }}>*</span></label>
          <input value={form.computingID} onChange={(e) => setForm({...form, computingID: e.target.value})} required style={inputStyle} placeholder="abc1d" />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Full Name <span style={{ color: "#dc3545" }}>*</span></label>
          <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required style={inputStyle} placeholder="John Doe" />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Year</label>
          <select value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} style={inputStyle}>
            <option value="">Select year...</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        
        <div style={{ marginBottom: "8px" }}>
          <label style={labelStyle}>Password <span style={{ color: "#dc3545" }}>*</span></label>
          <input type="password" value={form.password} onChange={handlePasswordChange} required style={{
            ...inputStyle,
            borderColor: form.password ? (isPasswordValid ? "#28a745" : "#dc3545") : "#dee2e6"
          }} />
        </div>

        {/* Password requirements */}
        <div style={{ marginBottom: "20px", fontSize: "0.8rem" }}>
          <div style={{ color: "#6c757d", marginBottom: "6px" }}>Password must contain:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            <Requirement met={form.password.length >= 8}>8+ characters</Requirement>
            <Requirement met={/[A-Z]/.test(form.password)}>Uppercase</Requirement>
            <Requirement met={/[a-z]/.test(form.password)}>Lowercase</Requirement>
            <Requirement met={/[0-9]/.test(form.password)}>Number</Requirement>
            <Requirement met={/[!@#$%^&*(),.?":{}|<>]/.test(form.password)}>Special char</Requirement>
          </div>
        </div>
        
        <button type="submit" disabled={loading || !isPasswordValid} style={{
          width: "100%",
          padding: "14px",
          background: (loading || !isPasswordValid) ? "#adb5bd" : UVA_NAVY,
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: (loading || !isPasswordValid) ? "not-allowed" : "pointer"
        }}>
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      
      <p style={{ textAlign: "center", marginTop: "20px", color: "#6c757d" }}>
        Already have an account? <Link to="/login" style={{ color: UVA_NAVY, fontWeight: 600 }}>Log In</Link>
      </p>
    </div>
  );
};

const Requirement = ({ met, children }) => (
  <div style={{ color: met ? "#28a745" : "#adb5bd", display: "flex", alignItems: "center", gap: "4px" }}>
    <span style={{ fontWeight: 600 }}>{met ? "✓" : "○"}</span> {children}
  </div>
);

const labelStyle = { display: "block", fontWeight: 500, marginBottom: "6px", color: "#495057", fontSize: "0.9rem" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "1rem", boxSizing: "border-box" };

export default SignUp;