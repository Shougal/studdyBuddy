import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const CreateGroup = ({ user }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ term: "Fall2025", mnemonic_num: "", description: "", date: "", start_time: "", end_time: "", building: "", room_number: "" });
  const [courses, setCourses] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsChecked, setRoomsChecked] = useState(false);

  useEffect(() => {
    if (user?.computingID) {
      const stored = localStorage.getItem(`enrollments_${user.computingID}`);
      setCourses(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  useEffect(() => {
    if (form.building) {
      setFilteredRooms(availableRooms.filter(r => r.building === form.building));
      setForm(p => ({ ...p, room_number: "" }));
    }
  }, [form.building, availableRooms]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const checkRooms = async () => {
    if (!form.date || !form.start_time || !form.end_time) { setError("Please select date and time"); return; }
    if (form.start_time >= form.end_time) { setError("End time must be after start time"); return; }
    setError(""); setRoomsLoading(true); setRoomsChecked(false);
    try {
      const res = await api.get("/rooms/free", { params: { date: form.date, start: form.start_time, end: form.end_time } });
      const rooms = res.data || [];
      setAvailableRooms(rooms);
      setBuildings([...new Set(rooms.map(r => r.building))].sort());
      setRoomsChecked(true);
    } catch { setError("Could not check room availability"); }
    finally { setRoomsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.room_number) { setError("Please select a room"); return; }
    setError(""); setLoading(true);
    try {
      const groupRes = await api.post("/groups", { ownerID: user.computingID, term: form.term, mnemonic: form.mnemonic_num, description: form.description });
      if (!groupRes.data.ok) throw new Error(groupRes.data.error);
      const groupID = groupRes.data.groupID;

      // Auto-join owner
      try { await api.post(`/groups/${groupID}/join`, { computingID: user.computingID }); } catch {}

      const sessionRes = await api.post(`/groups/${groupID}/session`, { date: form.date, start: form.start_time, end: form.end_time, building: form.building, room: form.room_number });
      if (!sessionRes.data.ok) throw new Error(sessionRes.data.error);

      toast.success("Study group created successfully");
      navigate("/");
    } catch (err) { setError(err.message || "Failed to create group"); }
    finally { setLoading(false); }
  };

  if (!user) return <div style={{ textAlign: "center", padding: "60px" }}><p>Please <Link to="/login" style={{ color: UVA_NAVY }}>log in</Link> to create a group.</p></div>;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <h2 style={{ color: UVA_NAVY, marginBottom: "20px", fontWeight: 600 }}>Create Study Group</h2>

      {/* Progress */}
      <div style={{ display: "flex", marginBottom: "24px", gap: "4px" }}>
        <ProgressStep num={1} label="Group Info" active={step >= 1} />
        <ProgressStep num={2} label="Schedule" active={step >= 2} />
      </div>

      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {error && <div style={{ background: "#fee", color: "#c00", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem" }}>{error}</div>}

        {step === 1 && (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Term</label>
              <input type="text" value={form.term} readOnly style={{ ...inputStyle, background: "#f8f9fa" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Course <span style={{ color: "#dc3545" }}>*</span></label>
              {courses.length === 0 ? (
                <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>No courses enrolled. <Link to="/schedule" style={{ color: UVA_NAVY }}>Enroll first</Link></p>
              ) : (
                <select name="mnemonic_num" value={form.mnemonic_num} onChange={handleChange} style={inputStyle}>
                  <option value="">Select a course...</option>
                  {courses.map((c, i) => <option key={`c-${c.mnemonic_num}-${i}`} value={c.mnemonic_num}>{c.mnemonic_num} - {c.name}</option>)}
                </select>
              )}
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="e.g., Exam review, homework help" rows={3} style={inputStyle} />
            </div>
            <button type="button" onClick={() => form.mnemonic_num ? setStep(2) : setError("Select a course")} style={btnPrimary}>
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Date <span style={{ color: "#dc3545" }}>*</span></label>
              <input type="date" name="date" value={form.date} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Start Time <span style={{ color: "#dc3545" }}>*</span></label>
                <input type="time" name="start_time" value={form.start_time} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>End Time <span style={{ color: "#dc3545" }}>*</span></label>
                <input type="time" name="end_time" value={form.end_time} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
            <button type="button" onClick={checkRooms} disabled={roomsLoading} style={{ ...btnSecondary, marginBottom: "16px", width: "100%" }}>
              {roomsLoading ? "Checking..." : "Check Available Rooms"}
            </button>

            {roomsChecked && (
              availableRooms.length === 0 ? (
                <div style={{ background: "#fee", padding: "12px", borderRadius: "6px", marginBottom: "16px", color: "#c00" }}>No rooms available at this time.</div>
              ) : (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Building <span style={{ color: "#dc3545" }}>*</span></label>
                    <select name="building" value={form.building} onChange={handleChange} style={inputStyle}>
                      <option value="">Select building...</option>
                      {buildings.map((b, i) => <option key={`b-${b}-${i}`} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {form.building && (
                    <div style={{ marginBottom: "24px" }}>
                      <label style={labelStyle}>Room <span style={{ color: "#dc3545" }}>*</span></label>
                      <select name="room_number" value={form.room_number} onChange={handleChange} style={inputStyle}>
                        <option value="">Select room...</option>
                        {filteredRooms.map((r, i) => <option key={`r-${r.room_number}-${i}`} value={r.room_number}>{r.room_number} (Capacity: {r.capacity})</option>)}
                      </select>
                    </div>
                  )}
                </>
              )
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setStep(1)} style={btnSecondary}>Back</button>
              <button type="submit" disabled={loading || !form.room_number} style={{ ...btnPrimary, flex: 1, opacity: form.room_number ? 1 : 0.6 }}>
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

const ProgressStep = ({ num, label, active }) => (
  <div style={{ flex: 1, textAlign: "center", padding: "12px", background: active ? UVA_NAVY : "#e9ecef", color: active ? "#fff" : "#6c757d", borderRadius: num === 1 ? "8px 0 0 8px" : "0 8px 8px 0", fontWeight: 500, fontSize: "0.9rem" }}>
    {num}. {label}
  </div>
);

const labelStyle = { display: "block", fontWeight: 500, marginBottom: "6px", color: "#495057", fontSize: "0.9rem" };
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "1rem", boxSizing: "border-box" };
const btnPrimary = { width: "100%", padding: "14px", background: "#232D4B", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" };
const btnSecondary = { padding: "12px 20px", background: "#e9ecef", color: "#495057", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 };

export default CreateGroup;