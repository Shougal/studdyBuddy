const TextArea = ({ label, name, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} />
  </div>
);
export default TextArea;
