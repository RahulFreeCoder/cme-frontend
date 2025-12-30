import React, { useMemo } from "react";
import { SEAT_TEXTS as T } from "../constants/eventDetailsText";
import SeatStatBox from "../ui/SeatStatBox";
import { Users, AlertTriangle } from "lucide-react";

export default function SeatAvailabilityCard({
  totalSeats,
  registeredSeats,
}) {
  const availableSeats = useMemo(
    () => totalSeats - registeredSeats,
    [totalSeats, registeredSeats]
  );

  const percentFull = useMemo(
    () => Math.round((registeredSeats / totalSeats) * 100),
    [registeredSeats, totalSeats]
  );

  // UX Logic: Determine status color based on availability
  const getStatusConfig = () => {
    if (percentFull >= 100) return { color: "bg-slate-500", label: "Sold Out", icon: null };
    if (percentFull >= 85) return { color: "bg-red-500", label: "Filling Fast", icon: <AlertTriangle className="w-3 h-3" /> };
    if (percentFull >= 60) return { color: "bg-orange-500", label: "Limited Seats", icon: null };
    return { color: "bg-emerald-500", label: "Registration Open", icon: null };
  };

  const status = getStatusConfig();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {/* Header with Status Badge */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-gray-900 font-bold">{T.title}</h2>
        </div>
        
        {/* Modern Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Stats Grid - Better alignment than flex */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <SeatStatBox
          label={T.labels.total}
          value={totalSeats}
        />
        <SeatStatBox
          label={T.labels.registered}
          value={registeredSeats}
          variant="success"
        />
        <SeatStatBox
          label={T.labels.available}
          value={availableSeats}
          // Highlight available if it's low
          variant={availableSeats < 10 && availableSeats > 0 ? "warning" : "default"}
        />
      </div>

      {/* Progress Bar with Micro-interaction */}
      <div className="space-y-3">
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-50">
          <div
            className={`h-full transition-all duration-1000 ease-out rounded-full ${status.color}`}
            style={{ width: `${percentFull}%` }}
          />
        </div>

        {/* Footer with improved clarity */}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>0% Booked</span>
            <span className={percentFull > 80 ? "text-red-500" : "text-slate-600"}>
                {percentFull} {T.misc.percentFull}
            </span>
            <span>100%</span>
        </div>
      </div>
    </div>
  );
}