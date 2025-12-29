import {useState } from 'react';
export default function MoreFiltersPopover({ hiddenFilters, onRemove }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 text-xs font-medium
                   rounded-full bg-gray-100
                   hover:bg-gray-200 transition"
      >
        +{hiddenFilters.length}
      </button>

      {open && (
        <div className="
          absolute right-0 mt-2
          bg-white rounded-xl shadow-lg
          border border-gray-100
          p-3 z-20 min-w-[200px]
        ">
          <div className="flex flex-wrap gap-2">
            {hiddenFilters.map(([k, v]) => (
              <span
                key={k}
                className="flex items-center gap-1
                           px-3 py-1 bg-blue-50
                           text-blue-700 rounded-full text-xs"
              >
                {k}: {v}
                <button
                  onClick={() => onRemove(k)}
                  className="ml-1 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
