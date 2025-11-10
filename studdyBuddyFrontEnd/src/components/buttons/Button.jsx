import React from "react";
import colors from "../../theme/colors";
import "./button.css";

const Button = ({ label, size = "medium", variant = "primary", onClick }) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
