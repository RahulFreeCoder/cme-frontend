import React from "react";

const IconLabel = React.memo(function IconLabel({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="bg-blue-100 rounded-lg p-3">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
});

export default IconLabel;
