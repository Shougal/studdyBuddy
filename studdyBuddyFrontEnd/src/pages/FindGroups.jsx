import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import SessionCard from "../components/cards/Sessioncard";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const FindGroups = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [myGroupIDs, setMyGroupIDs] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [termFilter, setTermFilter] = useState("Fall2025");
  const [courseFilter, setCourseFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user?.computingID) {
      const stored = localStorage.getItem(`enrollments_${user.computingID}`);
      if (stored) setEnrolledCourses(JSON.parse(stored).map(e => e.mnemonic_num));
      fetchMyGroupIDs();
    }
  }, [user]);

  const fetchMyGroupIDs = async () => {
    try {
      const res = await api.get(`/users/${user.computingID}/groups`);
      setMyGroupIDs((res.data || []).map(g => g.groupID));
    } catch {}
  };

  useEffect(() => { fetchGroups(); }, [termFilter, courseFilter, enrolledCourses]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/groups", { params: { q: searchQuery || courseFilter, termLike: termFilter, limit: 50 } });
      let results = res.data || [];

      const now = new Date();
      results = results.filter(g => {
        if (!g.date || !g.end_time) return true;
        return new Date(`${g.date}T${g.end_time}`) > now;
      });

      // Only show groups for enrolled courses
      if (enrolledCourses.length > 0) {
        results = results.filter(g => enrolledCourses.includes(g.mnemonic_num));
      }

      if (courseFilter) {
        results = results.filter(g => g.mnemonic_num === courseFilter);
      }

      setGroups(results);
    } catch {
      toast.error("Could not load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (g) => {
    try {
      const res = await api.post(`/groups/${g.groupID}/join`, { computingID: user.computingID });
      if (res.data.ok) {
        toast.success(`Joined ${g.mnemonic_num} study group`);
        setMyGroupIDs([...myGroupIDs, g.groupID]);
        fetchGroups();
      }
    } catch (err) {
      if (err.response?.data?.msg?.includes("Duplicate")) {
        toast.info("You're already a member of this group");
        setMyGroupIDs([...myGroupIDs, g.groupID]);
      } else {
        toast.error("Could not join group");
      }
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: UVA_NAVY, marginBottom: "20px", fontWeight: 600 }}>Find Study Groups</h2>
      
      {enrolledCourses.length === 0 && (
        <div style={{ background: "#fff3cd", padding: "16px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ffc107" }}>
          You haven't enrolled in any courses yet. <Link to="/schedule" style={{ color: UVA_NAVY, fontWeight: 600 }}>Enroll in courses</Link> to see available study groups.
        </div>
      )}

      {/* Search Filters */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={labelStyle}>Search</label>
            <input type="text" placeholder="Keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ minWidth: "180px" }}>
            <label style={labelStyle}>Course</label>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} style={inputStyle}>
              <option value="">All My Courses</option>
              {enrolledCourses.map((c, i) => <option key={`f-${c}-${i}`} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ minWidth: "140px" }}>
            <label style={labelStyle}>Term</label>
            <select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} style={inputStyle}>
              <option value="%">All Terms</option>
              <option value="Fall2025">Fall 2025</option>
              <option value="Spring2025">Spring 2025</option>
            </select>
          </div>
          <button onClick={fetchGroups} style={{ padding: "12px 24px", background: UVA_NAVY, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}>Loading...</div>
      ) : groups.length === 0 && enrolledCourses.length > 0 ? (
        <div style={{ background: "#fff", padding: "40px", borderRadius: "10px", textAlign: "center", color: "#6c757d" }}>
          No study groups found for your courses. <Link to="/create-group" style={{ color: UVA_NAVY, fontWeight: 600 }}>Create one</Link>
        </div>
      ) : (
        groups.map((g, i) => {
          const isOwner = g.owner_computingID === user?.computingID;
          const isMember = myGroupIDs.includes(g.groupID);
          return (
            <SessionCard
              key={`g-${g.groupID}-${i}`}
              groupID={g.groupID}
              mnemonic={g.mnemonic_num}
              courseName={g.course_name}
              description={g.description}
              date={g.date}
              start_time={g.start_time}
              end_time={g.end_time}
              building={g.building}
              room_number={g.room_number}
              members={g.members}
              ownerName={g.owner_name}
              isOwner={isOwner}
              isMember={isMember}
              showJoin={!isMember && !isOwner}
              onJoin={() => handleJoin(g)}
            />
          );
        })
      )}
    </div>
  );
};

const labelStyle = { display: "block", fontWeight: 500, marginBottom: "6px", color: "#495057", fontSize: "0.85rem" };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "0.95rem", boxSizing: "border-box" };

export default FindGroups;