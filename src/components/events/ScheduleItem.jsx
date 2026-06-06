import React, { useState } from "react";
import { BookOpen, Star, ChevronDown, ChevronUp } from "lucide-react";
import { dateFormatter, calculateDuration, formatTo12Hr } from "../utils/dataFormatter";

const ScheduleItem = React.memo(({ item, isFirst, isLast }) => {
  const [expandedBio, setExpandedBio] = useState(null);
  
  const startTime = formatTo12Hr(item.startTime);
  const endTime = formatTo12Hr(item.endTime);
  const duration = calculateDuration(item.startTime, item.endTime);

  const toggleBio = (idx) => {
    setExpandedBio(expandedBio === idx ? null : idx);
  };

  return (
    <div className="group relative flex flex-col md:flex-row gap-2 md:gap-8 pb-10 last:pb-0">
      
      {/* 1. TIME & DATE SECTION 
          Mobile: Horizontal Row | Desktop: Vertical Column */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-24 shrink-0 px-2 md:px-0">
        
        {/* Date & Start Time Group */}
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter md:mb-1">
            {dateFormatter(item.date)}
          </span>
          <span className="text-sm md:text-[13px] font-black text-slate-900 leading-none">
            {startTime}
          </span>
        </div>

        {/* Desktop Vertical Line Spacer */}
        <div className="hidden md:block h-3 w-px bg-slate-200 my-1 mr-4" /> 

        {/* End Time & Duration Group */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 leading-none">
            to {endTime}
          </span>
          {duration && (
            <div className="mt-1 md:mt-3 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-600 text-[11px] font-black uppercase">
              {duration}
            </div>
          )}
        </div>
      </div>

      {/* 2. THE TIMELINE DOT (Hidden on very small mobile if preferred, or kept for style) */}
      <div className="hidden md:flex flex-col items-center">
        <div className={`z-10 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-500 
          ${isFirst ? "bg-indigo-600 scale-110 ring-4 ring-indigo-50" : "bg-slate-300 group-hover:bg-indigo-500"}`} 
        />
        {!isLast && (
          <div className="w-0.5 h-full bg-slate-100 group-hover:bg-indigo-50 transition-colors" />
        )}
      </div>

      {/* 3. CONTENT CARD - Full width on mobile */}
      <div className="flex-1">
        <div className="p-5 md:p-6 bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] shadow-sm transition-all relative overflow-hidden">
          
          {/* Key Session Badge */}
          {item.speaker?.some(s => s.isKeySpeaker) && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">
              Keynote
            </div>
          )}
          
          <h4 className="text-slate-900 font-bold text-base md:text-lg mb-4 leading-snug flex items-start gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-500 rounded-xl shrink-0">
              <BookOpen size={16} />
            </span>
            {item.topics}
          </h4>
          
          {/* FACULTY SECTION */}
          <div className="space-y-2">
            {item.speaker?.map((sp, idx) => (
              <div key={idx} className="flex flex-col">
                <button 
                  onClick={() => sp.details && toggleBio(idx)}
                  className="flex items-center gap-3 p-2 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all text-left w-full"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                    {sp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-800 truncate flex items-center gap-1">
                      {sp.name}
                      {sp.isKeySpeaker && <Star size={10} className="fill-amber-400 text-amber-400" />}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{sp.speciality}</p>
                  </div>
                  {sp.details && (
                    <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${expandedBio === idx ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {expandedBio === idx && (
                  <div className="mt-2 mx-2 p-3 bg-indigo-50/50 rounded-xl border-l-2 border-indigo-400 text-[11px] text-slate-600 animate-in fade-in slide-in-from-top-1">
                    {sp.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleItem;