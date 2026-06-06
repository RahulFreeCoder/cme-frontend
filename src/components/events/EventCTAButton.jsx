
import { Eye, AlertTriangle, CheckCircle } from "lucide-react";

const CTA_CONFIG = {
  "Register Free": {
    color: "bg-green-500 hover:bg-green-600",
    icon: CheckCircle,
    analytics: "cta_register_free",
  },
  "Hurry Up": {
    color: "bg-red-500 hover:bg-red-600",
    icon: AlertTriangle,
    analytics: "cta_hurry_up",
  },
  "View": {
    color: "bg-blue-500 hover:bg-blue-600",
    icon: Eye,
    analytics: "cta_view_event",
  },
};

const trackEvent = (eventName, payload = {}) => {
  console.log("[Analytics]", eventName, payload);

  // Example:
  // window.gtag?.("event", eventName, payload);
  // mixpanel.track(eventName, payload);
};


export default function EventCTAButton({
  ctaLabel,
  event,
  seatsLeft,
  onClick,
}) {
  const isDisabled = false;
  const config = CTA_CONFIG[ctaLabel] ?? CTA_CONFIG.View;
  const Icon = config.icon;

  const handleClick = () => {
    trackEvent(config.analytics, {
      eventId: event.id,
      title: event.title,
      seatsLeft,
    });

    onClick(event);
  };

  return (
    <button
      disabled={isDisabled}
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium
        text-white shadow-sm transition-all
        ${isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : config.color}
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      aria-disabled={isDisabled}
      title={isDisabled ? "No seats available" : ctaLabel}
    >
      <Icon className="w-4 h-4" />
      {seatsLeft === 0 ? "View" : ctaLabel}
    </button>
  );
}

