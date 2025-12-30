import React, { useState } from "react";
import { MapPin, Navigation, Copy, Check } from "lucide-react";
import { LOCATION_TEXTS as T } from "../constants/eventDetailsText";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function EventLocationCard({ location }) {
  const [copied, setCopied] = useState(false);
  const hasApiKey = Boolean(GOOGLE_MAPS_KEY);
  
  // Construct the URL for the iframe (using Embed API) and for the external Redirect
  const encodedLocation = encodeURIComponent(location);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodedLocation}`;
  const externalMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* 1. HEADER & ACTIONS */}
      <div className="p-8 pb-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-slate-900 font-black text-sm uppercase tracking-wider">{T.title}</h2>
          </div>
          <p className="text-slate-500 text-xs font-medium ml-3.5">Venue & Navigation</p>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-slate-100"
                title="Copy Address"
            >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <a 
                href={externalMapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
                <Navigation size={14} />
                Directions
            </a>
        </div>
      </div>

      {/* 2. ADDRESS DISPLAY */}
      <div className="px-8 pb-6">
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-slate-700 font-bold text-sm leading-relaxed">
                {location}
            </p>
        </div>
      </div>

      {/* 3. MAP CONTAINER */}
      <div className="relative group w-full h-72 bg-slate-100 border-t border-slate-100">
        {hasApiKey ? (
          <>
            <iframe
                src={mapSrc}
                className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                allowFullScreen
                title="Event Location Map"
            />
            {/* Scrim Overlay to prevent accidental scrolling while scrolling the page */}
            <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-black/5 transition-colors" />
          </>
        ) : (
          <FallbackMap location={location} externalUrl={externalMapUrl} />
        )}
      </div>
    </div>
  );
}

function FallbackMap({ location, externalUrl }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-blue-400" />
      </div>
      <p className="text-slate-800 font-bold text-sm mb-1">{location}</p>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">Interactive Map Unavailable</p>
      <a 
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-xs font-bold underline decoration-blue-200 underline-offset-4 hover:text-blue-700"
      >
        View on Google Maps
      </a>
    </div>
  );
}