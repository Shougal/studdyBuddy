import React, { useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Select from "./Select";
import Button from "../buttons/Button";
import DateTimePicker from "./DateTimePicker";

const CreateGroupForm = ({ courses, onSubmit }) => {
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    term: "Fall2024",
    mnemonic_num: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    building: "",
    room_number: "",
    capacity: "",
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
      <h2>Create Study Group</h2>
      <Input label="Term" name="term" value={form.term} readOnly />
      <Select
        label="Course"
        name="mnemonic_num"
        value={form.mnemonic_num}
        onChange={handleChange}
        options={courses}
      />
      <TextArea
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <DateTimePicker
        label="Date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <Input
        label="Start Time"
        name="start_time"
        type="time"
        onChange={handleChange}
      />
      <Input
        label="End Time"
        name="end_time"
        type="time"
        onChange={handleChange}
      />
      <Input label="Building" name="building" onChange={handleChange} />
      <Input label="Room Number" name="room_number" onChange={handleChange} />
      <Input
        label="Capacity"
        name="capacity"
        type="number"
        onChange={handleChange}
      />
      <Button label="Create Group" size="medium" />
    </form>
  );
};

export default CreateGroupForm;
