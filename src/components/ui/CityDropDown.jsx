import FilterSelect
 from "./FilterSelect";
const OTHER_CITIES = [
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Indore",
  "Bhopal",
  "Surat",
  "Noida",
  "Gurgaon",
].sort();
const TIER_1 = ["Mumbai", "Pune", "Nagpur"];
const INDIAN_CITIES = [...TIER_1, ...OTHER_CITIES];

export default function CityDropdown({ value, onChange }) {
  return (
    <FilterSelect 
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Cities</option>
      {INDIAN_CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </FilterSelect>
  );
}
