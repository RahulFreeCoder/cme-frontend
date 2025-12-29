import React from "react";

const SectionCard = React.memo(({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
      {title && <h2 className="text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
});

export default SectionCard;
