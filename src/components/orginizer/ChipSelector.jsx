/* ChipsSelector.jsx  ---------------------------------------------------- */
import { useState } from "react";
import { X } from "lucide-react";

export default function ChipsSelector({
  options,       // array of strings – e.g. SPECIALITIES
  value,        // currently selected array of strings
  onChange,     // function(newArray)
  label,
  placeholder = "Type to search..."
}) {
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(false);

  // Filter options that are NOT already selected and match the query
  const filtered = options
    .filter((o) => !value.includes(o))
    .filter((o) => o.toLowerCase().includes(input.trim().toLowerCase()));

  const add = (item) => {
    onChange([...value, item]);
    setInput("");
    setShowList(false);
  };

  const remove = (item) => {
    onChange(value.filter((v) => v !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length === 1) {
      e.preventDefault();
      add(filtered[0]); // quick‑select the single match
    } else if (e.key === "Backspace" && input === "") {
      // delete the last chip when back‑space on empty input
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v, i) => (
          <span
            key={i}
            className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded flex items-center"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="ml-1 text-gray-600 hover:text-gray-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {/* Input + dropdown */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 150)} // delay so click works
          className="w-full p-2 border rounded"
          autoComplete="off"
        />

        {showList && filtered.length > 0 && (
          <ul
            className="absolute z-10 max-h-48 w-full overflow-y-auto bg-white border rounded shadow mt-1"
          >
            {filtered.map((opt, i) => (
              <li
                key={i}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onMouseDown={() => add(opt)} // use onMouseDown to avoid blur first
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
