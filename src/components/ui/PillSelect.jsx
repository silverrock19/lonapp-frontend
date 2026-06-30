const PillSelect = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
          value === opt
            ? 'border-[#0C5FC5] bg-[#0C5FC5] text-white'
            : 'border-neutral-200 bg-white text-neutral-600 hover:border-[#0C5FC5] hover:text-[#0C5FC5]'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default PillSelect;
