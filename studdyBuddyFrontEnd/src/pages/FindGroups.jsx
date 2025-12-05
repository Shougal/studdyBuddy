import React from "react";
import StudyGroupCard from "../components/cards/StudyGroupCard";

export default function FindGroups() {
  // This will be filtered by user schedule later
  const studyGroups = [
    {
      mnemonic: "CS3130",
      date: "Dec 1",
      building: "Thornton",
      start_time: "5 pm",
      end_time: "7 pm",
      members: 3,
      capacity: 6
    }
  ];

  return (
    <div>
      <h2>Available Study Groups</h2>

      {studyGroups.map((group, i) => (
        <StudyGroupCard 
          key={i} 
          {...group}
          onJoin={() => console.log("Joining group:", group)}
        />
      ))}
    </div>
  );
}
