const Select = ({ label, name, value, options = [], onChange }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}>
      <option value="">Select...</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
