import React, {useState, useMemo} from "react";
import { Calendar, MapPin, Users, Clock, Tag, ChevronDown, ChevronUp } from "lucide-react";
import ImageWithFallback from "../ImageWithFallback";
import CmeCreditBadge from "./CmecreditBadge";
import Meta from '../ui/Meta';
import Avatar from '../ui/Avatar';
import EventImage from "./EventImage";
import EventCTAButton from "./EventCTAButton";
import { dateFormatter, formatTimeRange, formatAddress, getFinalFeeInfo , getSeatStatus, getUniqueKeySpeakersFromSchedule} from "../utils/dataFormatter";
import sample from '../../assets/sample.jpg';


function EventCard({ event, onRegister, onViewEventDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const feeInfo = getFinalFeeInfo(event.registrationFees, "doctor");
  const [showSpeakerList, setShowSpeakerList] = useState(false);
  const featuredSpeakers = useMemo(
    () => getUniqueKeySpeakersFromSchedule(event.schedule),
    [event.schedule]);

  console.log('Featured Speaker:', featuredSpeakers);

  const { spotsLeft, isAlmostFull, isFull, isLimitedSeats } = useMemo(
    () => getSeatStatus(event.totalSeats, event.registeredSeats),
    [event.totalSeats, event.registeredSeats]
  );
  const ctaLabel =
        event.isRegistered ? "Registered" :
        event.price === 0 ? "Register Free" :
        isAlmostFull ? "Hurry Up" : 
        "View & Register";

  const toggleExpand = (e) => {
    e.stopPropagation(); // Prevents triggering card-level clicks if any
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-blue-100 group-hover:scale-105 transition-transform">
      <div className="relative">
        <EventImage
          src={sample}
        />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {event.speciality}
          </span>
        </div>
       <div className="absolute -bottom-4 right-4 z-10">
          <CmeCreditBadge credits={event.credits} />
        </div>
        {event.isRegistered ? 
          (
            <div className="absolute top-4 left-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                Registered
              </span>
            </div>
          ) 
          :
          <>
            {/*  Full Badge */}
            {isFull && (
              <div className="absolute top-4 left-4">
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                Full
                </span>
              </div>
            )}

            {/* Almost Full Badge */}
            {isAlmostFull && (
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  Almost Full
                </span>
              </div>
            )}
            {/* Limited Seats badge*/}
            {isLimitedSeats && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  Limited Seats
                </span>
              </div>
            )}
          </>
          }   
      </div>
          {/*Event Card body */}
      <div className="p-6 h-[300  px]">
        <div className="relative overflow-hidden transition-all duration-500">
          <h2 
            className={`text-slate-800 mb-2 text-l font-black leading-tight cursor-pointer ${isExpanded ? "" : "line-clamp-2"}`}
            onClick={toggleExpand}
          >
            {event.title.toUpperCase()}
          </h2>
          <div className="relative">
            <p className={`text-slate-600 text-sm leading-relaxed transition-all duration-500 ${isExpanded ? "mb-4" : "line-clamp-3 h-[56px]"}`}>
              {event.description}
            </p>
            
            {/* GRADIENT FADE: Only shows when collapsed to cue "more info" */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>

          {/* TOGGLE BUTTON */}
          <button 
            onClick={toggleExpand}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4 hover:text-blue-800 transition-colors"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp size={12} /></>
            ) : (
              <>Read More <ChevronDown size={12} /></>
            )}
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
         <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
            <Meta icon={Calendar} text={dateFormatter(event.startDate)} />
            <Meta icon={Clock} text={formatTimeRange(event?.startTime, event?.endTime)} />
          </div>
          <div className="grid grid-cols-1 text-sm text-gray-600">
              <Meta icon={MapPin} text={formatAddress(event.location)} />
          </div>

          <div className="flex items-center gap-2 mt-3 relative">
          <Avatar
            name={featuredSpeakers.length > 1 ? "M S" : featuredSpeakers[0]?.name}
            size="md"
          />
          
          <div 
            className="flex-1 cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation(); // Prevents card click (navigation) from firing
              if (featuredSpeakers.length > 1) setShowSpeakerList(!showSpeakerList);
            }}
          >
            <div className="flex items-center gap-1">
              <p className="font-medium text-slate-900">
                {featuredSpeakers.length > 1 
                  ? "Multiple Speakers" 
                  : (featuredSpeakers[0]?.name || "Faculty Assigned")}
              </p>
              {featuredSpeakers.length > 1 && (
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showSpeakerList ? 'rotate-180' : ''}`} />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {featuredSpeakers.length > 1 ? `${featuredSpeakers.length} Experts` : "Key Speaker"}
            </p>
          </div>
          {/* TOOLTIP / POPOVER */}
            {showSpeakerList && (
              <>
                {/* Backdrop to close tooltip when clicking outside */}
                <div className="fixed inset-0 z-10" onClick={() => setShowSpeakerList(false)} />
                
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-3 animate-in fade-in zoom-in duration-200 origin-bottom-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Featured Faculty</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {featuredSpeakers.map((sp, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[8px] font-black">
                          {sp.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{sp.name}</p>
                          <p className="text-[9px] text-slate-500 truncate">{sp.speciality}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Event Registration Footer */}
        <div className="border-t border-blue-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Registration Fee</p>
              {!feeInfo ? (
                  <p className="text-gray-400 font-medium">Not Available</p>
                ) : feeInfo.finalFee === 0 ? (
                  <p className="text-green-600 font-medium">Free</p>
                ) : (
                  <div>
                    <p className="text-blue-600 font-medium">₹ {feeInfo.finalFee} {feeInfo.hasDiscount && (
                      <span className="text-xs text-green-600"> (discount applied) </span>
                    )}
                    </p>
                    
                  </div>
                )} 
            </div>
            <EventCTAButton
              ctaLabel={ctaLabel}
              event={event}
              seatsLeft={spotsLeft}
              onClick={onViewEventDetails}
            />
          </div>
        </div>
      </div>
    </div>
           
  );
}
export default React.memo(EventCard)