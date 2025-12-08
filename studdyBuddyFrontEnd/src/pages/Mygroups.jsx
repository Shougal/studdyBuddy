import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const UVA_NAVY = "#232D4B";
const UVA_ORANGE = "#E57200";

const MyGroups = ({ user }) => {
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingID, setEditingID] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.computingID) fetchMyGroups();
    else setLoading(false);
  }, [user]);

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      // Get all groups and filter to ones user owns
      const res = await api.get("/groups", { params: { termLike: "%", limit: 100 } });
      const owned = (res.data || []).filter(g => g.owner_computingID === user.computingID);
      setMyGroups(owned);
    } catch { setError("Could not load groups"); }
    finally { setLoading(false); }
  };

  const startEdit = (g) => { setEditingID(g.groupID); setEditDesc(g.description || ""); };
  const cancelEdit = () => { setEditingID(null); setEditDesc(""); };

  const saveEdit = async (groupID) => {
    try {
      const res = await api.patch(`/groups/${groupID}`, { ownerID: user.computingID, description: editDesc });
      if (res.data.ok) { alert("Updated!"); setEditingID(null); fetchMyGroups(); }
      else alert(res.data.error || "Could not update");
    } catch { alert("Could not update"); }
  };

  const deleteGroup = async (g) => {
    if (!window.confirm(`Delete ${g.mnemonic_num} study group? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/groups/${g.groupID}`, { data: { ownerID: user.computingID } });
      if (res.data.ok) { alert("Deleted!"); fetchMyGroups(); }
      else alert(res.data.error || "Could not delete");
    } catch { alert("Could not delete"); }
  };

  if (!user) return <div style={{ textAlign: "center", padding: "40px" }}><p>Please <Link to="/login" style={{ color: UVA_NAVY }}>log in</Link></p></div>;
  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>;

  // Split into upcoming and past
  const now = new Date();
  const upcoming = myGroups.filter(g => !g.date || !g.end_time || new Date(`${g.date}T${g.end_time}`) > now);
  const past = myGroups.filter(g => g.date && g.end_time && new Date(`${g.date}T${g.end_time}`) <= now);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ color: UVA_NAVY }}>📋 My Study Groups</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>Groups you created. Edit or delete them here.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {myGroups.length === 0 && (
        <div style={{ background: "#fff", padding: "40px", borderRadius: "10px", textAlign: "center" }}>
          <p>You haven't created any study groups yet.</p>
          <Link to="/create-group" style={{ color: UVA_NAVY, fontWeight: 600 }}>→ Create your first group</Link>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <h3 style={{ color: UVA_NAVY, borderBottom: `2px solid ${UVA_NAVY}`, paddingBottom: "8px" }}>Upcoming ({upcoming.length})</h3>
          {upcoming.map((g, i) => (
            <GroupCard key={`up-${g.groupID}-${i}`} group={g} user={user} editingID={editingID} editDesc={editDesc} setEditDesc={setEditDesc}
              startEdit={startEdit} cancelEdit={cancelEdit} saveEdit={saveEdit} deleteGroup={deleteGroup} navigate={navigate} />
          ))}
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h3 style={{ color: "#7f8c8d", borderBottom: "2px solid #bdc3c7", paddingBottom: "8px" }}>Past ({past.length})</h3>
          {past.map((g, i) => (
            <GroupCard key={`past-${g.groupID}-${i}`} group={g} user={user} editingID={editingID} editDesc={editDesc} setEditDesc={setEditDesc}
              startEdit={startEdit} cancelEdit={cancelEdit} saveEdit={saveEdit} deleteGroup={deleteGroup} navigate={navigate} isPast />
          ))}
        </section>
      )}
    </div>
  );
};

// Sub-component for each group card
const GroupCard = ({ group: g, user, editingID, editDesc, setEditDesc, startEdit, cancelEdit, saveEdit, deleteGroup, navigate, isPast }) => (
  <div style={{ background: "#fff", border: `2px solid ${isPast ? "#ccc" : UVA_NAVY}`, borderRadius: "10px", padding: "20px", marginBottom: "16px", opacity: isPast ? 0.85 : 1 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h3 style={{ margin: 0, color: UVA_NAVY }}>
        {g.mnemonic_num}
        <span style={{ marginLeft: "10px", fontSize: "0.7rem", background: UVA_ORANGE, color: "#fff", padding: "3px 8px", borderRadius: "10px" }}>OWNER</span>
        {isPast && <span style={{ marginLeft: "6px", fontSize: "0.7rem", background: "#7f8c8d", color: "#fff", padding: "3px 8px", borderRadius: "10px" }}>COMPLETED</span>}
      </h3>
      <span style={{ color: "#666" }}>{g.members || 0} members</span>
    </div>

    <p style={{ margin: "12px 0", color: "#555" }}>
      📅 {g.date || "Not scheduled"} | 🕐 {g.start_time || "?"} - {g.end_time || "?"} | 📍 {g.building || "?"} {g.room_number || ""}
    </p>

    {editingID === g.groupID ? (
      <div style={{ background: "#f9f9f9", padding: "16px", borderRadius: "8px" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}>Description</label>
        <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "12px" }} />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => saveEdit(g.groupID)} style={{ padding: "8px 16px", background: "#27ae60", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Save</button>
          <button onClick={cancelEdit} style={{ padding: "8px 16px", background: "#ccc", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    ) : (
      <>
        <p style={{ fontStyle: "italic", color: "#666", background: "#f5f5f5", padding: "10px", borderRadius: "6px", margin: "12px 0" }}>
          "{g.description || "No description"}"
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => startEdit(g)} style={{ padding: "8px 16px", background: UVA_NAVY, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>✏️ Edit</button>
          <button onClick={() => navigate(`/groups/${g.groupID}`)} style={{ padding: "8px 16px", background: "#ecf0f1", border: "none", borderRadius: "6px", cursor: "pointer" }}>View Details</button>
          {isPast && (
            <button onClick={() => navigate(`/feedback/${g.groupID}?view=summary`)} style={{ padding: "8px 16px", background: "#8e44ad", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>📊 View Feedback</button>
          )}
          <button onClick={() => deleteGroup(g)} style={{ padding: "8px 16px", background: "#c0392b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>🗑️ Delete</button>
        </div>
      </>
    )}
  </div>
);

export default MyGroups;