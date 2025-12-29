import React from "react";

function Meta({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-blue-500" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}

export default React.memo(Meta);