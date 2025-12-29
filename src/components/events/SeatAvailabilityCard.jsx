import React, { useMemo } from "react";
import { SEAT_TEXTS as T } from "../constants/eventDetailsText";
import SeatStatBox from "../ui/SeatStatBox";

export default function SeatAvailabilityCard({
  totalSeats,
  registeredSeats,
}) {
  const availableSeats = useMemo(
    () => totalSeats - registeredSeats,
    [totalSeats, registeredSeats]
  );

  const percentFull = useMemo(
    () => Math.round((registeredSeats / totalSeats) * 1000) / 10,
    [registeredSeats, totalSeats]
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8">
      <h2 className="text-gray-900 mb-6">{T.title}</h2>

      {/* Stats */}
      <div className="flex gap-6 mb-8">
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
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
          style={{ width: `${percentFull}%` }}
        />
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-lg">
        {percentFull}
        {T.misc.percentFull}
      </div>
    </div>
  );
}
