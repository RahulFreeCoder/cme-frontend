import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import { UserStar, GraduationCap, Quote } from "lucide-react";

const SpeakerCard = React.memo(({ speaker }) => {
  return (
    <div className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-[2rem] border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      
      {/* 1. Profile Section */}
      <div className="relative shrink-0 mx-auto sm:mx-0">
        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-indigo-400 group-hover:rotate-6 transition-transform duration-500">
          <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100">
            <ImageWithFallback
              src={speaker.photo || UserStar} // Use actual photo if available
              alt={speaker.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Subtle Expert Badge */}
        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
          <UserStar size={12} />
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="flex-1 space-y-2 text-center sm:text-left">
        <div>
          <h3 className="text-slate-900 font-black text-lg leading-none mb-1">
            {speaker.name}
          </h3>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-600">
            <GraduationCap size={14} />
            <span className="text-xs font-black uppercase tracking-widest">
              {speaker.designation}
            </span>
          </div>
        </div>

        {/* 3. Biography with Quote Style */}
        <div className="relative">
          <Quote className="absolute -left-2 -top-1 w-4 h-4 text-slate-100 -scale-x-100" />
          <p className="text-slate-500 text-sm leading-relaxed pl-4 line-clamp-3 italic group-hover:text-slate-600 transition-colors">
            {speaker.details}
          </p>
        </div>
      </div>

      {/* Modern Interaction Accent */}
      <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Speaker Profile</span>
      </div>
    </div>
  );
});

export default SpeakerCard;