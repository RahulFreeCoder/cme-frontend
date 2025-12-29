import React, {useState, useMemo} from "react";
import { Calendar, MapPin, Users, Clock, Tag } from "lucide-react";
import ImageWithFallback from "../ImageWithFallback";
import CmeCreditBadge from "./CmecreditBadge";
import Meta from '../ui/Meta';
import Avatar from '../ui/Avatar';
import EventImage from "./EventImage";
import EventCTAButton from "./EventCTAButton";
import { dateFormatter, formatTimeRange, formatAddress, getFinalFeeInfo , getSeatStatus, getUniqueKeySpeakersFromSchedule} from "../utils/dataFormatter";
import sample from '../../assets/sample.jpg';


function EventCard({ event, onRegister, onViewEventDetails }) {
  const feeInfo = getFinalFeeInfo(event.registrationFees, "doctor");
  const featuredSpeakers = useMemo(
    () => getUniqueKeySpeakersFromSchedule(event.speakers),
    [event.speakers]);

  const { spotsLeft, isAlmostFull, isFull, isLimitedSeats } = useMemo(
    () => getSeatStatus(event.totalSeats, event.registeredSeats),
    [event.totalSeats, event.registeredSeats]
  );
  const ctaLabel =
        event.isRegistered ? "Registered" :
        event.price === 0 ? "Register Free" :
        isAlmostFull ? "Hurry Up" : 
        "View & Register";


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
      <div className="p-6">
        <h3 className="text-gray-900 mb-2 text-xl">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
         <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
            <Meta icon={Calendar} text={dateFormatter(event.startDate)} />
            <Meta icon={Clock} text={formatTimeRange(event.startTime, event.endTime)} />
          </div>
          <div className="grid grid-cols-1 text-sm text-gray-600">
              <Meta icon={MapPin} text={formatAddress(event.location)} />
          </div>

          <div className="flex items-center gap-2 mt-3">
           <Avatar
            name={event.speaker}
            size="md"
          />
            <div>
              <p className="font-medium">{featuredSpeakers[0].name}</p>
              <p className="text-xs text-gray-500">Key Speaker</p>
            </div>
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