import React, { useState } from "react";
import CreateGroupForm from "../components/forms/CreateGroupForm";

export const CreateGroup = () => {
  const [error, setError] = useState("");

  const checkTime = (form) => {
    const { start_time, end_time } = form;

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
