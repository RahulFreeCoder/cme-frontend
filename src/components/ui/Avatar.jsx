import React from "react";

const FALLBACK_INITIALS = "NA";

export default function Avatar({
  src,
  name,
  size = "md",
  shape = "circle",
  className = "",
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-lg",
  };

  const radius = shape === "square" ? "rounded-lg" : "rounded-full";

  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || FALLBACK_INITIALS;

  return src ? (
    <img
      src={src}
      alt={name}
      className={`${sizes[size]} ${radius} object-cover shadow-sm ${className}`}
    />
  ) : (
    <div
      className={`${sizes[size]} ${radius} flex items-center justify-center
        bg-blue-100 text-blue-700 font-semibold shadow-sm ${className}`}
    >
      {initials}
    </div>
  );
}
