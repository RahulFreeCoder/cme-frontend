const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      w-full
      rounded-md
      border border-blue-300
      bg-blue-50
      px-3 py-2
      text-blue-900
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
  >
    {children}
  </select>
);

export default FilterSelect