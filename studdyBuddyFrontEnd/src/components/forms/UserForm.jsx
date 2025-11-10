import React, { useState } from "react";
import Input from "./Input";
import Select from "./Select";
import Button from "../buttons/Button";
import "./form.css";

const UserForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    computingID: "",
    name: "",
    year: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form
      className="form-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <h2>Create Account</h2>

      <Input
        label="Computing ID"
        name="computingID"
        onChange={handleChange}
        value={form.computingID}
        required
      />
      <Input
        label="Full Name"
        name="name"
        onChange={handleChange}
        value={form.name}
        required
      />
      <Select
        label="Year"
        name="year"
        value={form.year}
        onChange={handleChange}
        options={["1st", "2nd", "3rd", "4th"]}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        onChange={handleChange}
        value={form.password}
        required
      />
      <Button label="Register" size="medium" />
    </form>
  );
};

export default UserForm;
