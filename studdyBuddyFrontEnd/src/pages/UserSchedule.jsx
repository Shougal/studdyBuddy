import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const UserSchedule = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("Fall2025");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user?.computingID) {
      const stored = localStorage.getItem(`enrollments_${user.computingID}`);
      if (stored) setMyCourses(JSON.parse(stored));
    }
  }, [user]);

  useEffect(() => {
    if (user?.computingID && myCourses.length > 0) {
      localStorage.setItem(`enrollments_${user.computingID}`, JSON.stringify(myCourses));
    }
  }, [myCourses, user]);

  useEffect(() => { fetchCourses(); }, [selectedTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/offerings", { params: { termLike: `${selectedTerm}%` } });
      setCourses(res.data || []);
    } catch {
      toast.error("Could not load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse) { toast.error("Please select a course"); return; }
    try {
      await api.post("/enroll", { computingID: user.computingID, term: selectedTerm, mnemonic: selectedCourse });
      const info = courses.find(c => c.mnemonic_num === selectedCourse);
      if (!myCourses.some(c => c.mnemonic_num === selectedCourse)) {
        setMyCourses([...myCourses, { term: selectedTerm, mnemonic_num: selectedCourse, name: info?.name || selectedCourse }]);
      }
      toast.success(`Enrolled in ${selectedCourse}`);
      setSelectedCourse("");
    } catch (err) {
      if (err.response?.data?.error?.includes("Duplicate")) {
        const info = courses.find(c => c.mnemonic_num === selectedCourse);
        if (!myCourses.some(c => c.mnemonic_num === selectedCourse)) {
          setMyCourses([...myCourses, { term: selectedTerm, mnemonic_num: selectedCourse, name: info?.name || selectedCourse }]);
        }
        toast.success(`${selectedCourse} added`);
        setSelectedCourse("");
      } else {
        toast.error("Could not enroll");
      }
    }
  };

  const handleRemove = (c) => {
    const updated = myCourses.filter(x => !(x.term === c.term && x.mnemonic_num === c.mnemonic_num));
    setMyCourses(updated);
    updated.length === 0 ? localStorage.removeItem(`enrollments_${user.computingID}`) : localStorage.setItem(`enrollments_${user.computingID}`, JSON.stringify(updated));
    toast.info(`Removed ${c.mnemonic_num}`);
  };

  if (!user) return <div style={{ textAlign: "center", padding: "60px" }}><p>Please <Link to="/login" style={{ color: UVA_NAVY }}>log in</Link></p></div>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ color: UVA_NAVY, marginBottom: "8px", fontWeight: 600 }}>My Courses</h2>
      <p style={{ color: "#6c757d", marginBottom: "24px" }}>Enroll in courses to find and create study groups.</p>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Term</label>
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} style={inputStyle}>
            <option value="Fall2025">Fall 2025</option>
            <option value="Spring2025">Spring 2025</option>
            <option value="Spring2026">Spring 2026</option>
          </select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Course</label>
          {loading ? <p style={{ color: "#6c757d" }}>Loading...</p> : (
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={inputStyle}>
              <option value="">Select a course...</option>
              {courses.map((c, i) => <option key={`${c.mnemonic_num}-${i}`} value={c.mnemonic_num}>{c.mnemonic_num} - {c.name}</option>)}
            </select>
          )}
        </div>
        <button onClick={handleEnroll} style={{ width: "100%", padding: "14px", background: UVA_NAVY, color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
          Enroll
        </button>
      </div>

      <h3 style={{ color: UVA_NAVY, marginBottom: "16px", fontWeight: 600 }}>
        Enrolled Courses <span style={{ fontWeight: 400, color: "#6c757d" }}>({myCourses.length})</span>
      </h3>
      
      {myCourses.length === 0 ? (
        <div style={{ background: "#fff", padding: "32px", borderRadius: "10px", textAlign: "center", color: "#6c757d" }}>
          No courses enrolled yet.
        </div>
      ) : (
        <div>
          {myCourses.map((c, i) => (
            <div key={`${c.mnemonic_num}-${i}`} style={{
              background: "#fff",
              padding: "16px 20px",
              marginBottom: "10px",
              borderRadius: "10px",
              borderLeft: `4px solid ${UVA_NAVY}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: UVA_NAVY }}>{c.mnemonic_num}</div>
                <div style={{ color: "#6c757d", fontSize: "0.9rem" }}>{c.name} · {c.term}</div>
              </div>
              <button onClick={() => handleRemove(c)} style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 500
              }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: 500, marginBottom: "6px", color: "#495057", fontSize: "0.9rem" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "1rem", boxSizing: "border-box" };

export default UserSchedule;