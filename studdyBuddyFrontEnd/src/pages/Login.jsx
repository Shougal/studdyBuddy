import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const Login = ({ onLogin }) => {
  const [computingID, setComputingID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/login", { computingID, password });
      console.log("Login Response:", res.data);
      if (res.data.ok) {
        toast.success("Welcome back!");
        onLogin(res.data.user || { computingID, name: computingID });
        navigate("/");
      } else {
        setError(res.data.error || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "380px", margin: "60px auto" }}>
      <h2 style={{ textAlign: "center", color: UVA_NAVY, marginBottom: "24px", fontWeight: 600 }}>Log In</h2>
      
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {error && <div style={{ background: "#fee", color: "#c00", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem" }}>{error}</div>}
        
        <div style={{ marginBottom: "18px" }}>
          <label style={labelStyle}>Computing ID</label>
          <input type="text" value={computingID} onChange={(e) => setComputingID(e.target.value)} required style={inputStyle} placeholder="abc1d" />
        </div>
        
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        </div>
        
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#adb5bd" : UVA_NAVY, color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <p style={{ textAlign: "center", marginTop: "20px", color: "#6c757d" }}>
        Don't have an account? <Link to="/signup" style={{ color: UVA_NAVY, fontWeight: 600 }}>Sign Up</Link>
      </p>
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: 500, marginBottom: "6px", color: "#495057", fontSize: "0.9rem" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "1rem", boxSizing: "border-box" };

export default Login;