import { useState, useEffect } from "react";

export default function GridNumberEditor({ value, onValueChange }) {
  const [local, setLocal] = useState(value ?? "");

  useEffect(() => onValueChange(local), [local, onValueChange]);

  return (
    <input
      type="number"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      className="w-full h-full p-1 border-none"
    />
  );
}
