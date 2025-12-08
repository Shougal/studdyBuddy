import React from "react";
import { useNavigate } from "react-router-dom";

const UVA_NAVY = "#232D4B";
const UVA_ORANGE = "#E57200";

const SessionCard = ({
  groupID, mnemonic, courseName, description,
  date, start_time, end_time, building, room_number,
  members, ownerName, isOwner = false, isMember = false, isPast = false,
  onJoin, onLeave, onDelete, onFeedback, onViewFeedback,
  showJoin = false, showLeave = false, showDelete = false,
  showFeedback = false, showViewFeedback = false
}) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#fff",
      border: isPast ? "1px solid #dee2e6" : `1px solid ${UVA_NAVY}`,
      borderRadius: "10px",
      padding: "20px 24px",
      marginBottom: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      opacity: isPast ? 0.9 : 1
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <h3 style={{ margin: "0 0 4px 0", color: UVA_NAVY, fontSize: "1.15rem", fontWeight: 600 }}>
            {mnemonic}
            {courseName && <span style={{ fontWeight: 400, color: "#6c757d" }}> · {courseName}</span>}
          </h3>
          {description && <p style={{ margin: 0, color: "#6c757d", fontSize: "0.9rem" }}>{description}</p>}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {isOwner && <Badge color={UVA_ORANGE}>Owner</Badge>}
          {isMember && !isOwner && <Badge color="#27ae60">Enrolled</Badge>}
          {isPast && <Badge color="#6c757d">Completed</Badge>}
        </div>
      </div>

      {/* Details */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "16px", fontSize: "0.9rem", color: "#495057" }}>
        <Detail label="Date" value={formatDate(date)} />
        <Detail label="Time" value={`${formatTime(start_time)} - ${formatTime(end_time)}`} />
        <Detail label="Location" value={`${building || "TBD"} ${room_number || ""}`} />
        <Detail label="Members" value={members || 0} />
        {ownerName && <Detail label="Host" value={ownerName} />}
      </div>

    {/* Actions */}
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "14px", borderTop: "1px solid #e9ecef" }}>
    <Button onClick={() => navigate(`/groups/${groupID}`)} variant="secondary">
        View Details
    </Button>

    {/* ✅ JOIN: only if NOT member and NOT owner */}
    {!isMember && !isOwner && showJoin && (
        <Button onClick={onJoin} variant="primary">
        Join Group
        </Button>
    )}

    {/* ✅ ENROLLED badge handled visually already — no button */}

    {/* ✅ LEAVE: only if member AND NOT owner */}
    {isMember && !isOwner && showLeave && (
        <Button onClick={onLeave} variant="danger">
        Leave
        </Button>
    )}

    {/* ✅ DELETE: only if owner */}
    {isOwner && showDelete && (
        <Button onClick={onDelete} variant="danger">
        Delete
        </Button>
    )}

    {/* ✅ Feedback rules unchanged */}
    {showFeedback && isPast && !isOwner && (
        <Button onClick={onFeedback} variant="success">
        Give Feedback
        </Button>
    )}

    {showViewFeedback && isPast && isOwner && (
        <Button onClick={onViewFeedback} variant="purple">
        View Feedback
        </Button>
    )}
    </div>

    </div>
  );
};

const Badge = ({ children, color }) => (
  <span style={{
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 600,
    background: color,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  }}>
    {children}
  </span>
);

const Detail = ({ label, value }) => (
  <div>
    <div style={{ fontSize: "0.75rem", color: "#868e96", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    <div style={{ fontWeight: 500, color: "#212529" }}>{value}</div>
  </div>
);

const Button = ({ children, onClick, variant = "secondary" }) => {
  const styles = {
    primary: { background: "#232D4B", color: "#fff" },
    secondary: { background: "#e9ecef", color: "#495057" },
    danger: { background: "#dc3545", color: "#fff" },
    success: { background: "#28a745", color: "#fff" },
    purple: { background: "#6f42c1", color: "#fff" }
  };
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "0.875rem",
      ...styles[variant]
    }}>
      {children}
    </button>
  );
};

const formatDate = (d) => {
  if (!d) return "TBD";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const formatTime = (t) => {
  if (!t) return "?";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

export default SessionCard;