import { useState, useEffect } from "react";

export default function GridDateEditor({ value, onValueChange }) {
  // keep local value in ISO format -> YYYY-MM-DD
  const [local, setLocal] = useState(value?.slice(0, 10) ?? "");

  useEffect(() => onValueChange(local), [local, onValueChange]);

  return (
    <input
      type="date"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      className="w-full h-full p-1 border-none"
    />
  );
}
