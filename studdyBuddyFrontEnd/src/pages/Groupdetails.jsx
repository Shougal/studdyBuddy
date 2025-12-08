import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";
const UVA_ORANGE = "#E57200";

const GroupDetails = ({ user }) => {
  const { groupID } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchGroup();
    if (user?.computingID) checkMembership();
  }, [groupID, user]);

  const fetchGroup = async () => {
    try { 
      setGroup((await api.get(`/groups/${groupID}`)).data); 
    } catch { 
      toast.error("Could not load group"); 
    } finally { 
      setLoading(false); 
    }
  };

  const checkMembership = async () => {
    try {
      const res = await api.get(`/users/${user.computingID}/groups`);
      setIsMember((res.data || []).some(g => g.groupID === parseInt(groupID)));
    } catch {}
  };

  const handleLeave = async () => {
    try {
      await api.post(`/groups/${groupID}/leave`, { computingID: user.computingID });
      toast.success("Left group");
      setIsMember(false);
      fetchGroup();
    } catch { 
      toast.error("Could not leave group"); 
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "#6c757d" }}>Loading...</div>;
  if (!group) return <div style={{ textAlign: "center", padding: "60px", color: "#6c757d" }}>Group not found</div>;

  const isOwner = group.owner_computingID === user?.computingID;
  const isPast = group.date && group.end_time && new Date(`${group.date}T${group.end_time}`) < new Date();

  const formatDate = (d) => {
    if (!d) return "TBD";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatTime = (t) => {
    if (!t) return "?";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: UVA_NAVY, cursor: "pointer", marginBottom: "20px", fontSize: "0.95rem", fontWeight: 500 }}>
        ← Back
      </button>

      <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h2 style={{ margin: "0 0 4px 0", color: UVA_NAVY, fontWeight: 600 }}>{group.mnemonic_num}</h2>
            {group.course_name && <p style={{ margin: 0, color: "#6c757d" }}>{group.course_name}</p>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {isOwner && <Badge color={UVA_ORANGE}>Owner</Badge>}
            {isMember && !isOwner && <Badge color="#27ae60">Enrolled</Badge>}
            {isPast && <Badge color="#6c757d">Completed</Badge>}
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
            <p style={{ margin: 0, fontStyle: "italic", color: "#495057" }}>{group.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
          <DetailItem label="Date" value={formatDate(group.date)} />
          <DetailItem label="Time" value={`${formatTime(group.start_time)} - ${formatTime(group.end_time)}`} />
          <DetailItem label="Location" value={`${group.building || "TBD"} ${group.room_number || ""}`} />
          <DetailItem label="Members" value={group.members || 0} />
          <DetailItem label="Host" value={group.owner_name || "Unknown"} />
          <DetailItem label="Term" value={group.term} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", paddingTop: "20px", borderTop: "1px solid #e9ecef" }}>
          {/* Show Leave if member or owner */}
          {(isMember || isOwner) && !isPast && (
            <Button onClick={handleLeave} variant="danger">Leave Group</Button>
          )}
          
          {/* Feedback buttons for past sessions */}
          {isPast && !isOwner && (
            <Button onClick={() => navigate(`/feedback/${groupID}`)} variant="success">Give Feedback</Button>
          )}
          {isPast && isOwner && (
            <Button onClick={() => navigate(`/feedback/${groupID}?view=summary`)} variant="purple">View Feedback</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, color }) => (
  <span style={{ padding: "5px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, background: color, color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>
    {children}
  </span>
);

const DetailItem = ({ label, value }) => (
  <div>
    <div style={{ fontSize: "0.75rem", color: "#868e96", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    <div style={{ fontWeight: 500, color: "#212529", fontSize: "1rem" }}>{value}</div>
  </div>
);

const Button = ({ children, onClick, variant }) => {
  const styles = {
    primary: { background: "#232D4B", color: "#fff" },
    danger: { background: "#dc3545", color: "#fff" },
    success: { background: "#28a745", color: "#fff" },
    purple: { background: "#6f42c1", color: "#fff" }
  };
  return (
    <button onClick={onClick} style={{ padding: "12px 24px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.95rem", ...styles[variant] }}>
      {children}
    </button>
  );
};

export default GroupDetails;