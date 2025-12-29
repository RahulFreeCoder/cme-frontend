import React from "react";

const styles = {
  primary: "bg-blue-500 text-white",
  danger: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
  neutral: "bg-gray-500 text-white",
};

const Badge = React.memo(function Badge({ variant = "primary", children }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${styles[variant]}`}>
      {children}
    </span>
  );
});

export default Badge;
