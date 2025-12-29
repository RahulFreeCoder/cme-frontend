import { MapPin } from "lucide-react";
import { LOCATION_TEXTS as T } from "../constants/eventDetailsText";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function EventLocationCard({ location }) {
  const hasApiKey = Boolean(GOOGLE_MAPS_KEY);

  const mapSrc = hasApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(
        location
      )}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <h2 className="text-gray-900 mb-4">{T.title}</h2>

      {/* Location Row */}
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <MapPin className="w-5 h-5 text-blue-500" />
        <p>{location}</p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
        {hasApiKey ? (
          <iframe
            src={mapSrc}
            className="w-full h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Event Location Map"
          />
        ) : (
          <FallbackMap location={location} />
        )}
      </div>
    </div>
  );
}

/* ---------- Fallback UI (NO API KEY / ERROR SAFE) ---------- */
function FallbackMap({ location }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gradient-to-br from-blue-100 to-blue-50">
      <MapPin className="w-14 h-14 text-blue-400 mb-3" />
      <p className="text-gray-800 font-medium">{location}</p>
      <p className="text-gray-500 text-sm mt-2">
        {T.mapUnavailable}
      </p>
    </div>
  );
}
