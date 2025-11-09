import React from "react";
import Button from "../buttons/Button";
import "./card.css";

/**
 * This will be the display of study groups, which is our session table joined with study group, also joined with location
 * @param {*} param0
 * @returns
 */
const StudyGroupCard = ({
  mnemonic,
  building,
  start_time,
  end_time,
  date,
  capacity,
  members,
  onJoin,
}) => (
  <div className="study-card">
    <h3>
      <span className="label">Course:</span>
      {mnemonic}
    </h3>
    <div className="descriptions">
      <p>
        {" "}
        <span className="label">Date:</span>
        {date}
      </p>
      <p>
        {" "}
        <span className="label"> Building:</span>
        {building}
      </p>
      <p>
        {" "}
        <span className="label"> Start Time:</span>
        {start_time}
      </p>
      <p>
        {" "}
        <span className="label"> End Time:</span>
        {end_time}
      </p>
      <p>
        {" "}
        <span className="label"> Members:</span>
        {members}
      </p>
      <p>
        {" "}
        <span className="label"> Capacity:</span>
        {capacity}
      </p>
      <Button label="Join Group" size="small" onClick={onJoin} />
    </div>
  </div>
);

export default StudyGroupCard;
