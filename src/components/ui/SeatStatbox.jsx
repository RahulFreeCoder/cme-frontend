import React from "react";
import { Users, Ticket, UserCheck, Lock } from "lucide-react";

const SeatStatBox = React.memo(({ label, value, variant, iconType }) => {
  // Mapping icons to labels for better visual UX
  const icons = {
    total: <Users size={20} />,
    booked: <UserCheck size={20} />,
    available: <Ticket size={20} />,
    reserved: <Lock size={20} />,
  };

  const variantStyles = {
    // Default: Professional Slate/Blue
    default: "bg-white border-slate-200 text-slate-800 shadow-sm shadow-slate-100 group-hover:border-blue-300 group-hover:bg-blue-50/30",
    // Success: High Contrast Teal/Emerald
    success: "bg-white border-emerald-100 text-emerald-700 shadow-sm shadow-emerald-50 group-hover:border-emerald-300 group-hover:bg-emerald-50/50",
    // Warning/Danger: For "Low Availability"
    warning: "bg-white border-amber-100 text-amber-700 shadow-sm shadow-amber-50 group-hover:border-amber-300 group-hover:bg-amber-50/50",
  };

  const iconColors = {
    default: "bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white",
    success: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    warning: "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  };

  return (
    <div
      className={`group flex-1 flex flex-col items-center justify-center rounded-[2rem] border p-8 transition-all duration-300 active:scale-95 ${
        variantStyles[variant || "default"]
      }`}
    >
      {/* 1. Icon Header */}
      <div className={`mb-4 p-3 rounded-2xl transition-all duration-300 ${iconColors[variant || "default"]}`}>
        {icons[iconType] || <Users size={20} />}
      </div>

      {/* 2. Content */}
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <p className="text-3xl font-black tabular-nums tracking-tight">
          {value}
        </p>
      </div>
      
      {/* 3. Subtle Indicator Line */}
      <div className={`h-1 w-8 rounded-full mt-4 opacity-20 group-hover:opacity-100 transition-all duration-500 ${
        variant === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
      }`} />
    </div>
  );
});

export default SeatStatBox;