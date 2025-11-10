import React from "react";
import UserForm from "../components/forms/UserForm";

const User = () => {
  const handleSubmit = (data) => {
    console.log("User Registered:", data);
    alert(`User Created:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div style={{ margin: "40px auto", maxWidth: "500px" }}>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};

export default User;
