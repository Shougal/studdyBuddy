import React from "react";
import "./form.css";

const DateTimePicker = ({ label, name, value, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        className="date-input"
      />
    </div>
  );
};

export default DateTimePicker;
