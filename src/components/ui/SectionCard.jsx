import React from "react";

const SectionCard = React.memo(({ title, icon, children, className = "" }) => {
  return (
    <div className={`
      bg-white 
      rounded-[2rem] 
      border border-slate-200/60 
      shadow-sm shadow-slate-200/50 
      transition-all duration-300 
      hover:shadow-xl hover:shadow-blue-500/5 
      hover:border-blue-100
      overflow-hidden
      ${className}
    `}>
      {title && (
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* The Accent Bar */}
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            
            <h2 className="text-slate-900 font-black text-sm uppercase tracking-wider">
              {title}
            </h2>
            
            {icon && <span className="text-slate-400 ml-1">{icon}</span>}
          </div>
        </div>
      )}
      
      <div className={`px-8 pb-8 ${!title ? "pt-8" : "pt-2"}`}>
        {children}
      </div>
    </div>
  );
});

export default SectionCard;