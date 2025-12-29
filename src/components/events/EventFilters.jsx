import MoreFiltersPopover from "../ui/MoreFiltersPopOver";
import CityDropdown from "../ui/CityDropDown";

export default function EventFilters({ filters, setFilters, removeFilter }) {
    const MAX_VISIBLE = 2;

    const entries = Object.entries(filters || {});
    const visibleFilters = entries.slice(0, MAX_VISIBLE);
    const hiddenCount = entries.length - MAX_VISIBLE;

  return (
    <div className="sticky top-[64px] z-10 bg-white px-2 py-1">

      <div className="flex flex-wrap items-center gap-4">

        {/* DATE */}
        <FilterItem label="Date">
          <input
            type="date"
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
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
          />
        </FilterItem>

        {/* LOCATION */}
        <FilterItem label="Location">
          <CityDropdown
            value={filters?.location || ""}
            onChange={(city) =>
              setFilters({ ...(filters || {}), location: city })
            }
          />
      </FilterItem>

        {/* SPECIALITY */}
        <FilterItem label="Speciality">
          <div className="flex gap-2">
            {["Cardiology", "Pediatrics", "Dermatology"].map((s) => (
              <button
                key={s}
                onClick={() =>
                  setFilters({ ...filters, speciality: s })
                }
                className={`px-3 py-1 rounded-full text-sm
                  ${filters?.speciality === s
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </FilterItem>

        {/* PRICE */}
        <FilterItem label="Price (₹)">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            className="w-32"
            onChange={(e) =>
              setFilters({ ...filters, price: e.target.value })
            }
          />
          <span className="text-xs text-gray-500">
            Up to ₹{filters?.price || "Any"}
          </span>
        </FilterItem>

        {/* CREDITS */}
        <FilterItem label="Credits">
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            className="w-24"
            onChange={(e) =>
              setFilters({ ...filters, credits: e.target.value })
            }
          />
          <span className="text-xs text-gray-500">
            ≥ {filters?.credits || 0}
          </span>
        </FilterItem>
        {filters && Object.keys(filters).length > 0 && (
                  <div
                    className="
                      absolute
                      right-20
                      bg-white/90 backdrop-blur
                      rounded-xl
                      shadow-md
                      border border-blue-100
                    "
                  >
                    <div className="relative flex items-center gap-2">
                        {visibleFilters.map(([k, v]) => (
                            <span
                            key={k}
                            className="flex items-center gap-1
                                        px-3 py-1
                                        bg-blue-50 text-blue-700
                                        rounded-full text-xs font-medium
                                        whitespace-nowrap"
                            >
                            {k}: {v}
                            <button
                                onClick={() => removeFilter(k)}
                                className="ml-1 text-blue-400 hover:text-blue-600"
                            >
                                ×
                            </button>
                            </span>
                        ))}
                        {hiddenCount > 0 && (
                            <MoreFiltersPopover
                                hiddenFilters={entries.slice(MAX_VISIBLE)}
                                onRemove={removeFilter}
                            />
                        )}
                  </div>
                </div>
         )}       
        {/* CLEAR */}
        <button
          onClick={() => setFilters({})}
          className="ml-auto text-sm text-red-500 hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

function FilterItem({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {children}
    </div>
  );
}
