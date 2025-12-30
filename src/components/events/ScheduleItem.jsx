import React, { useState } from "react";
import { User, Clock, BookOpen, Star, ChevronDown, ChevronUp } from "lucide-react";
import { dateFormatter, formatTimeRange } from "../utils/dataFormatter";

const ScheduleItem = React.memo(({ item, isFirst, isLast }) => {
  // Local state to track which speaker biography is expanded
  const [expandedBio, setExpandedBio] = useState(null);

  const toggleBio = (idx) => {
    setExpandedBio(expandedBio === idx ? null : idx);
  };

  return (
    <div className="group relative flex gap-6 pb-12 last:pb-0">
      {/* 1. TIMELINE VISUALIZER */}
      <div className="flex flex-col items-center">
        <div className={`z-10 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-500 
          ${isFirst ? "bg-indigo-600 scale-125 ring-4 ring-indigo-50" : "bg-slate-300 group-hover:bg-indigo-500"}`} 
        />
        {!isLast && (
          <div className="w-0.5 h-full bg-slate-200 group-hover:bg-indigo-100 transition-colors" />
        )}
      </div>

      {/* 2. CONTENT CARD */}
      <div className="flex-1 -mt-1.5">
        <div className="flex items-center gap-3 mb-3">
          <p className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
            {dateFormatter(item.date)}
          </p>
          <div className="h-px flex-1 bg-slate-100" />
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600">
            <Clock className="w-3.5 h-3.5" />
            {formatTimeRange(item.time)}
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-[2rem] group-hover:border-indigo-200 transition-all duration-500 relative overflow-hidden">
          {item.speaker?.some(s => s.isKeySpeaker) && (
            <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-xl shadow-sm">
              Featured Session
            </div>
          )}
          
          <h4 className="text-slate-900 font-black text-lg mb-6 leading-tight flex items-start gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen size={18} />
            </span>
            {item.topics}
          </h4>
          
          {/* FACULTY SECTION */}
          <div className="flex flex-col gap-3">
            {item.speaker && item.speaker.length > 0 ? (
              item.speaker.map((sp, idx) => (
                <div key={idx} className="flex flex-col w-full">
                  <button 
                    onClick={() => toggleBio(idx)}
                    className={`flex items-center gap-3 p-2 pr-4 rounded-2xl border text-left transition-all duration-300 w-fit
                      ${sp.isKeySpeaker 
                        ? "bg-amber-50/50 border-amber-100" 
                        : "bg-slate-50 border-slate-100 hover:border-indigo-200"}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0
                      ${sp.isKeySpeaker ? "bg-amber-100 text-amber-700" : "bg-white text-slate-500"}`}>
                      {sp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-800 truncate">{sp.name}</p>
                        {sp.isKeySpeaker && <Star size={10} className="fill-amber-400 text-amber-400" />}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                        {sp.designation || sp.speciality || "Faculty"}
                      </p>
                    </div>

                    {sp.details && (
                      <div className="text-slate-300 group-hover:text-indigo-400">
                        {expandedBio === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    )}
                  </button>

                  {/* EXPANDABLE BIOGRAPHY SECTION */}
                  {expandedBio === idx && sp.details && (
                    <div className="mt-2 ml-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                       <div className="flex gap-3">
                          <div className="w-0.5 h-auto bg-indigo-200 rounded-full my-1" />
                          <p className="text-xs text-slate-600 leading-relaxed italic">
                            {sp.details}
                          </p>
                       </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl group-hover:border-slate-300 transition-colors">
              <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
                <User size={10} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                N/A
              </span>
              {/* Optional Tooltip-style hint for clarity */}
              <span className="text-[9px] font-bold text-slate-300 uppercase italic ml-1">
                (Non-Academic)
              </span>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScheduleItem;