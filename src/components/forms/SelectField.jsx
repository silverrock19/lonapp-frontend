const SelectField = ({ label, required, value, onChange, children, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-small font-semibold text-neutral-800">
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
    >
      {children}
    </select>
    {error && <p className="text-caption text-error-text">{error}</p>}
  </div>
);

export default SelectField;
