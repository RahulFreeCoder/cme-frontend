import React from "react";

const SeatStatBox = React.memo(({ label, value, variant }) => {
  const variantStyles = {
    default: "bg-blue-50 border-blue-200 text-blue-600",
    success: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div
      className={`flex-1 text-center rounded-xl border p-6 ${
        variantStyles[variant || "default"]
      }`}
    >
      <p className="text-gray-600 mb-2">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
});

export default SeatStatBox;
