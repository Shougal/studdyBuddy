import React from "react";
import Button from "../buttons/Button";
import "./card.css";

// ============================================
// STUDY GROUP CARD
// Displays one study group with session info
// Used in FindGroups (Join) and Home (Leave)
// ============================================
const StudyGroupCard = ({
  mnemonic,
  courseName,
  building,
  room_number,
  start_time,
  end_time,
  date,
  members,
  ownerName,
  description,
  buttonLabel = "Join Group",  // can be "Leave Group"
  onJoin,
}) => {
  return (
    <div className="study-card">
      {/* COURSE TITLE */}
      <h3>
        <span className="label">Course: </span>
        {mnemonic}
        {courseName && (
          <span style={{ fontWeight: 400, fontSize: "0.9rem" }}> - {courseName}</span>
        )}
      </h3>

      {/* DESCRIPTION */}
      {description && (
        <p style={{ fontStyle: "italic", color: "#555", marginBottom: "12px" }}>
          "{description}"
        </p>
      )}

      {/* SESSION DETAILS */}
      <div className="descriptions">
        <p><span className="label">Date: </span>{date}</p>
        <p><span className="label">Building: </span>{building}</p>
        <p><span className="label">Time: </span>{start_time} - {end_time}</p>
        {members !== undefined && (
          <p><span className="label">Members: </span>{members}</p>
        )}
        {ownerName && (
          <p><span className="label">Owner: </span>{ownerName}</p>
        )}
        
        {/* JOIN/LEAVE BUTTON */}
        <Button
          label={buttonLabel}
          size="small"
          variant={buttonLabel.includes("Leave") ? "secondary" : "primary"}
          onClick={onJoin}
        />
      </div>
    </div>
  );
};

export default StudyGroupCard;