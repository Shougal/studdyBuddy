const Input = ({
  label,
  name,
  value,
  type = "text",
  onChange,
  readOnly,
  required,
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      readOnly={readOnly}
      required={required}
    />
  </div>
);
export default Input;
