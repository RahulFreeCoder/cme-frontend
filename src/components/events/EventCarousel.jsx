import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import EventCard from "./EventCard";

export default function EventCarousel({ events, onViewEventDetails }) {
  if (!Array.isArray(events) || events.length === 0) {
    return null; // or loading skeleton
  }
  return (
    <div className="relative">

      {/* LEFT ARROW */}
      <button
        className="swiper-prev absolute -left-12 top-1/2 -translate-y-1/2
                   hidden md:flex items-center justify-center
                   w-10 h-10 rounded-full bg-white shadow-md
                   hover:bg-blue-50 z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-blue-600" />
      </button>

      {/* RIGHT ARROW */}
      <button
        className="swiper-next absolute -right-12 top-1/2 -translate-y-1/2
                   hidden md:flex items-center justify-center
                   w-10 h-10 rounded-full bg-white shadow-md
                   hover:bg-blue-50 z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-blue-600" />
      </button>

      {/* SWIPER */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        spaceBetween={24}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 1.1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="px-2"
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
      >
        {events.map((event) => (
          <SwiperSlide key={event.id}>
            <EventCard event={event} onViewEventDetails={onViewEventDetails} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}
