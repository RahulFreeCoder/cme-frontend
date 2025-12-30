import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Calendar, Clock, Users, GraduationCap, 
  CheckCircle, Gift, Speaker, Filter, X, Search 
} from "lucide-react";
import { getUpcomingEvents, getEventStats } from "../redux/events/eventsSlice";
import StatsCard from "../components/events/StatsCard";
import AuthModal from '../components/AuthModal';
import EventDetails from '../components/events/EventDetails';
import EventCarousel from "../components/events/EventCarousel";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import EventRegistrationModal from "../components/events/EventRegistrationModal";
import { toDateTimestamp } from "../components/utils/dataFormatter";
import { clearCMERegistrationStatus } from "../redux/events/cmeRegistrationSlice";

export default function Home() {
  const [pendingEvent, setPendingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false); 
  
  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const dispatch = useDispatch();
  const { events, loading } = useSelector((s) => s.events);
  const [filters, setFilters] = useState(null);

  // --- LOGIC: Handle Registration Flow ---
  const handleRegister = (event) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      setPendingEvent(event); // Store the event to auto-open registration after login
      return;
    }
    setSelectedEvent(event);
    setOpenRegisterModal(true);
  };

  // --- LOGIC: THE MISSING FUNCTION ---
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (pendingEvent) {
      setSelectedEvent(pendingEvent);
      setOpenRegisterModal(true);
      setPendingEvent(null); // Clear the queue
    }
  };

  // --- LOGIC: Filtering ---
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.filter((e) => {
      if (filters?.location && e.location?.city !== filters.location) return false;
      if (filters?.date) {
        const eventDate = toDateTimestamp(e.startDate);
        const selectedDate = toDateTimestamp(filters.date);
        if (!eventDate || eventDate < selectedDate) return false;
      }
      if (filters?.speciality) {
        if (!Array.isArray(e.speciality) || !e.speciality.includes(filters.speciality)) return false;
      }
      if (filters?.price) {
        const hasValidPrice = Array.isArray(e.registrationFees) && e.registrationFees.some((f) => f.price <= filters.price);
        if (!hasValidPrice) return false;
      }
      if (filters?.credits && e.credits < filters.credits) return false;
      return true;
    });
  }, [events, filters]);

  const removeFilter = (key) => {
    setFilters((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      delete updated[key];
      return Object.keys(updated).length ? updated : null;
    });
  };

  // SINGLE PASS CALCULATION
  const statsData = useMemo(() => {
    // Initial state
    const result = {
      totalSeats: 0,
      keySpeakersCount: 0,
      freeEventsCount: 0,
      totalCredits: 0
    };

    if (!events || !Array.isArray(events)) return result;

    const uniqueSpeakers = new Set();

    events.forEach((event) => {
      // 1. Total Seats
      result.totalSeats += Number(event?.totalSeats) || 0;

      // 2. Total Credits
      result.totalCredits += Number(event?.credits) || 0;

      // 3. Free Events Count
      // We check if at least one fee tier has a price of 0
      const isFree = !event?.registrationFees || 
               !Array.isArray(event.registrationFees) || 
               event.registrationFees.length === 0 || 
               event.registrationFees.some(fee => Number(fee?.price) === 0);

      if (isFree) {
        result.freeEventsCount++;
      }

      // 4. Unique Key Speakers
      if (event?.speakers && Array.isArray(event.speakers)) {
        event.speakers.forEach((speaker) => {
          if (speaker?.isKeySpeaker && speaker?.name) {
            // Normalizing name to prevent duplicates due to spacing or case
            uniqueSpeakers.add(speaker.name.trim().toLowerCase());
          }
        });
      }
    });

    result.keySpeakersCount = uniqueSpeakers.size;
    return result;
  }, [events]);

  // Destructure for easy use in JSX
  const { totalSeats, keySpeakersCount, freeEventsCount, totalCredits } = statsData;

  if (!events && loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Medical Events...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-[1600px] mx-auto px-6 py-4">
        {openRegisterModal && (
          <EventRegistrationModal 
            event={selectedEvent} 
            user={user} 
            onClose={() => {
              setOpenRegisterModal(false);
              dispatch(clearCMERegistrationStatus());
            }} 
          />
        )}

        {selectedEvent && !openRegisterModal ? (
          <EventDetails 
            event={selectedEvent} 
            onBack={() => setSelectedEvent(null)} 
            onRegister={handleRegister} 
          />
        ) : (
          <div className="space-y-8">
            {/* COMPACT STATS */}
            <div className="flex flex-col">
            {/* STATS GRID - Tightened gap and margin */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2">
                <StatsCard icon={Clock} label="Upcoming" value={events?.length || 0} color="bg-indigo-600" />
                <StatsCard icon={Gift} label="Free" value={freeEventsCount} color="bg-emerald-600" />
                <StatsCard icon={CheckCircle} label="Joined" value={1} color="bg-slate-800" />
                <StatsCard icon={GraduationCap} label="Credits" value={totalCredits.toFixed(1)} color="bg-cyan-600" />
                <StatsCard icon={Users} label="Seats" value={totalSeats} color="bg-rose-600" />
                <StatsCard icon={Speaker} label="Speakers" value={keySpeakersCount} color="bg-amber-700" />
            </div>

            {/* FILTER SECTION - Sticky but stays in flow */}
            <div className="sticky top-0 z-30 mb-2">
                <div className={`bg-white border border-slate-200 shadow-sm flex items-center justify-between px-3 py-1 transition-all ${showFilters ? "rounded-t-xl border-b-0" : "rounded-xl"}`}>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        showFilters ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    >
                    <Filter size={12} /> {showFilters ? "CLOSE" : "FILTER"}
                    </button>

                    {/* ACTIVE CHIPS */}
                    {filters && Object.entries(filters).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100 text-[9px] font-black uppercase whitespace-nowrap animate-in fade-in zoom-in-95">
                        <span className="opacity-50">{key}:</span> {value}
                        <X size={10} className="cursor-pointer hover:text-red-500 ml-1" onClick={() => removeFilter(key)} />
                    </div>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    <Search size={12} /> {filteredEvents.length} RESULTS
                </div>
                </div>

                {/* DRAWER - Integrated into the flow with zero bottom margin */}
                {showFilters && (
                <div className="bg-white border border-slate-200 border-t-0 rounded-b-xl px-4 py-2 shadow-lg animate-in slide-in-from-top-1 duration-200">
                    {/* Pass a prop or class to EventFilters to remove its own internal padding/margins if necessary */}
                    <div className="compact-filters-wrapper">
                    <EventFilters filters={filters} setFilters={setFilters} removeFilter={removeFilter} />
                    </div>
                </div>
                )}
            </div>
            {/* CONTENT SECTION - Direct Grid Layout */}
                <section className="mt-4">
                    {!loading && filteredEvents.length === 0 ? (
                        <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                No matching events found
                            </p>
                        </div>
                    ) : (
                        /* Grid configuration: 
                        - 1 column on mobile (1.1 effect is removed for standard vertical scroll)
                        - 2 columns on tablets
                        - 3 columns on desktops 
                        */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard 
                                    key={event.id || event._id} 
                                    event={event} 
                                    onViewEventDetails={setSelectedEvent} 
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
          </div>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </div>
  );
}   