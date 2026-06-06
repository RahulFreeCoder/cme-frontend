import React, { useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Award,
  CheckCircle,
  XCircle,
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Info,
   CheckCircle2,
} from "lucide-react";

import SectionCard from "../ui/SectionCard";
import SpeakerCard from "../ui/SpeakerCard";
import ScheduleItem from "./ScheduleItem";
import SeatAvailabilityCard from './SeatAvailabilityCard';
import EventLocationCard from "./EventLocationCard";
import InfoRow from '../ui/InfoRow';
import ImageWithFallback from "../ImageWithFallback";
import { EVENT_DETAIL_TEXTS as T } from "../constants/eventDetailsText";
import { 
  dateFormatter, 
  formatTimeRange, 
  formatAddress, 
  getFinalFeeInfo, 
  getSeatStatus, 
  getUniqueKeySpeakersFromSchedule, 
  getDiscountedFee 
} from "../utils/dataFormatter";
import EventImage from "./EventImage";
import AdditionalInfo from "./AdditionalInfo";
import sample from '../../assets/sample.jpg';

export default function EventDetail({ event, onBack, onRegister, isRegistered }) {
  // --- Original Logic Blocks ---
  const { isAlmostFull, isFull } = useMemo(
    () => getSeatStatus(event.totalSeats, event.registeredSeats),
    [event.totalSeats, event.registeredSeats]
  );

  const feeInfo = getFinalFeeInfo(event.registrationFees, "doctor");

  const featuredSpeakers = useMemo(
    () => getUniqueKeySpeakersFromSchedule(event.schedule),
    [event.sxhedule]
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation - Professional sticky-style placement */}
        <div className="py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-900 font-black text-[10px] uppercase tracking-widest hover:bg-white px-4 py-2 rounded-full transition shadow-sm bg-white/50 border border-slate-200"
            aria-label={T.navigation.back}
          >
            <ArrowLeft className="w-4 h-4" />
            {T.navigation.back}
          </button>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="relative h-[400px]">
            <ImageWithFallback src={sample} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end">
              <div className="p-8 text-white w-full flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {event.speciality}
                    </span>
                    {isAlmostFull && <span className="bg-orange-500 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">{T.badges.almostFull}</span>}
                    {isFull && <span className="bg-slate-600 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{T.badges.soldOut}</span>}
                    {isRegistered && (
                      <span className="bg-emerald-500 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" /> {T.badges.registered}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-black mb-3 leading-tight">{event.title}</h1>
                </div>

                {/* REGISTRATION CARD - Logic preserved exactly */}
                <div className="bg-white text-slate-900 rounded-2xl p-6 w-full md:w-80 shadow-2xl border border-slate-100 mb-2">
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">
                    {T.labels.registrationFee}
                  </p>
                  {event.registrationFees?.length > 0 ? (
                  <ul className="space-y-3 mb-6">
                    {event.registrationFees.map((fee, idx) => {
                      const finalPrice = getDiscountedFee(fee);
                      return (
                        <li
                          key={idx}
                          className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-bold text-sm">
                              {fee.category}
                            </span>
                            {fee.rule && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                {fee.rule}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-black text-base ${
                                finalPrice === 0 ? "text-emerald-600" : "text-blue-600"
                              }`}>
                              {finalPrice === 0 ? "Free" : `₹ ${finalPrice.toLocaleString()}`}
                            </span>
                            {fee.discountPercent > 0 && (
                              <div className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                                Discount Applied
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  ): (
                    <div className="mb-8 p-6 bg-emerald-50/50 border border-dashed border-emerald-200 rounded-2xl text-center group-hover:bg-emerald-50 transition-colors">
                      <div className="w-10 h-10 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <p className="text-emerald-700 font-black text-[11px] uppercase tracking-[0.15em]">
                        Free Entry
                      </p>
                      <p className="text-[10px] text-emerald-600/70 font-bold uppercase mt-1">
                        Complimentary Registration
                      </p>
                    </div>
                  )} 
                  <button
                    onClick={() => onRegister(event)}
                    disabled={isRegistered || isFull}
                    className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${
                      isRegistered || isFull 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                    }`}
                  >
                    {isRegistered ? T.buttons.registered : isFull ? T.buttons.full : T.buttons.registerNow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: PRIMARY DETAILS */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="About this Event">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-sm leading-7 font-medium whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </SectionCard>
            <SectionCard title={T.sections.eventDetails}>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Calendar, label: T.labels.date, value: dateFormatter(event.startDate) },
                  { icon: Clock, label: T.labels.time, value: formatTimeRange(event.startTime, event.endTime) },
                  { icon: MapPin, label: T.labels.location, value: formatAddress(event.location) },
                  { icon: Tag, label: T.labels.category, value: event.speciality },
                  { icon: Award, label: T.labels.credit, value: `${event.credits} Points` }
                ].map((item, i) => {
                  const IconComponent = item.icon; // Extract component for JSX usage
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="bg-blue-50 p-3 rounded-xl h-fit">
                        <IconComponent className="w-5 h-5 text-blue-600" /> {/* FIXED: Render as component */}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-slate-800 font-bold text-sm leading-snug">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SeatAvailabilityCard
              totalSeats={event.totalSeats}
              registeredSeats={event.registeredSeats}
            />    

            <SectionCard title={T.sections.eventSchedule}>
              <div className="space-y-4">
                {event.schedule.map((item, idx) => (
                  <ScheduleItem key={idx} item={item} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title={T.sections.speakers}>
              <div className="grid gap-4">
                {featuredSpeakers.length > 0 ? (
                  featuredSpeakers.map((s, idx) => (
                    <SpeakerCard key={idx} speaker={s} />
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm">No speaker profiles available.</p>
                )}
              </div>
            </SectionCard>

            <EventLocationCard location={formatAddress(event.location)} />
          </div>

          {/* RIGHT COLUMN: SECONDARY INFO */}
          <div className="space-y-8">
            <SectionCard title={T.sections.organizer}>
              <div className="space-y-5">
                <InfoRow
                  icon={<Building2 className="w-4 h-4" />}
                  label={T.labels.organization}
                  value={event.organizer.organization}
                />
                <InfoRow
                  icon={<Mail className="w-4 h-4" />}
                  label={T.labels.email}
                  value={event.organizer.email}
                  isLink
                  href={`mailto:${event.organizer.email}`}
                />
                <InfoRow
                  icon={<Phone className="w-4 h-4" />}
                  label={T.labels.phone}
                  value={event.organizer.phone}
                  isLink
                  href={`tel:${event.organizer.phone}`}
                />
                <InfoRow
                  icon={<Globe className="w-4 h-4" />}
                  label={T.labels.website}
                  value={event.organizer.website}
                  isLink
                  href={`https://${event.organizer.website}`}
                />
              </div>
            </SectionCard>
      
            <AdditionalInfo info={event.additionalInformation} />
          </div>
        </div>
      </div>
    </div>
  );
}