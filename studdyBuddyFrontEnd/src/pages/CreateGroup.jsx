import React, { useState } from "react";
import CreateGroupForm from "../components/forms/CreateGroupForm";

export const CreateGroup = () => {
  const [error, setError] = useState("");

  function parseTime12ToDate(timeStr) {
    if (!timeStr) return null;

    const [time, modifier] = timeStr.split(" "); // e.g. ["09:00", "PM"]
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return new Date(1970, 0, 1, hours, minutes, 0);
  }

  const checkTime = (form) => {
    const { start_time, end_time } = form;
    // const start = parseTime12ToDate(start_time);
    // const end = parseTime12ToDate(end_time);

    if (!start_time || !end_time) {
      alert("Please select both start and end times.");
      setError("Please select both start and end times.");
      return false;
    }

    if (start_time >= end_time) {
      alert("Start time must be earlier than end time.");
      setError("Start time must be earlier than end time.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (form) => {
    // First validate the times
    const isValid = checkTime(form);
    if (!isValid) return; // stop if invalid

    // Then proceed with actual submit logic
    console.log("Valid group created:", form);
  };

  return (
    <div>
      <CreateGroupForm onSubmit={handleSubmit} error={error} />
    </div>
  );
};
