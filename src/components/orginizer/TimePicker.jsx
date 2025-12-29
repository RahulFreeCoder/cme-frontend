/* src/components/TimePickerDigital12.jsx */
import { useState, useRef, useEffect } from "react";

/* -------------------------------------------------------------- */
//  build a small list of wanted minute values (0,15,30,45)
const MINUTES = ["00", "15", "30", "45"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1‑12
const PERIODS = ["AM", "PM"];
/* -------------------------------------------------------------- */

export default function TimePickerDigital({ label, value, onChange }) {
  /* ---- internal state that stays in sync with the 24‑hr `value` prop ---- */
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");
  const [errors, setErrors] = useState({});
  // sync any incoming prop value (e.g. when editing an existing CME)
  useEffect(() => {
    if (!value) return;

    // normalize "10:" → "10:00 AM"
    let v = value.trim();

    if (/^\d{1,2}:$/.test(v)) {
      v = `${v}00 AM`;
    }

    const match = v.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
    if (!match) return;

    const [, h, m, p] = match;

    setHour(parseInt(h, 10));
    setMinute(m);
    setPeriod(p.toUpperCase());
  }, [value]);



  const emit12 = (h, m, p) => {
    const out = `${String(h).padStart(2, "0")}:${m} ${p}`;
      onChange(out);
    };
  

  /* -- UI ----------------------------------------------------------- */
  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="12"
          value={hour}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1 && v <= 12) {
              setHour(v);
              emit12(v, minute, period);
            }
          }}
          className="w-20 p-2 border rounded"
        />

        <span className="text-sm">:</span>

        <select
            value={minute}
            onChange={(e) => {
              setMinute(e.target.value);
              emit12(hour, e.target.value, period);
            }}
            className="w-20 p-2 border rounded"
          >
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              emit12(hour, minute, e.target.value);
            }}
            className="w-20 p-2 border rounded"
          >
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      {/* -------------- quick‑list (optional) ------------ */}
      {/* You can add a drop‑down list that jumps to the chosen time if you want. */}
    </div>
  );
}
