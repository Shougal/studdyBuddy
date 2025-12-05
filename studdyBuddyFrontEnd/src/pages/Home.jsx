import React, { useState } from "react";
import StudyGroupCard from "../components/cards/StudyGroupCard";

export default function Home() {
  // In the future this will come from backend Joins + Session
  const [mySessions] = useState([
    {
      mnemonic: "CS3130",
      date: "Nov 6",
      building: "Rice",
      start_time: "9 am",
      end_time: "12 pm",
      members: 10,
      capacity: 15,
    }
  ]);

  return (
    <div>
      <h2>Upcoming Sessions</h2>

      {mySessions.length === 0 && <p>No upcoming sessions.</p>}

      {mySessions.map((s, i) => (
        <StudyGroupCard key={i} {...s} onJoin={() => {}} />
      ))}
    </div>
  );
}
