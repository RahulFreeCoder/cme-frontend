import React from "react";

const Card = React.memo(function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow ${className}`}
    >
      {children}
    </div>
  );
});

export default Card;
