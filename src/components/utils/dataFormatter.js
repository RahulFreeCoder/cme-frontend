export const dateFormatter = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

export const formatTimeRange = (start, end) => {
  // 1. Guard against empty start time
  if (!start || start === "undefined") return "Time TBA";

  const startTime = formatHHMM(start);
  
  // 2. Guard against invalid formatting results
  if (!startTime || startTime.includes("undefined")) return "Time TBA";

  // 3. Handle case where end time is missing or identical to start
  if (!end || end === "undefined" || start === end) {
    return startTime;
  }

  const endTime = formatHHMM(end);
  
  // 4. Guard against invalid end time formatting
  if (!endTime || endTime.includes("undefined")) {
    return startTime;
  }

  return `${startTime} - ${endTime}`;
};
export const formatHHMM = (time) => {
  if (!time) return "";

  const parts = time.split(" ");
  const timePart = parts[0];
  const meridiem = parts[1] ?? "";

  const [hh, mm] = timePart.split(":");

  return `${hh}:${mm}${meridiem ? " " + meridiem : ""}`;
};

export const formatAddress = (location = {}) =>
  [location.address, location.city].filter(Boolean).join(", ");

export const getFeeByCategory = (fees = [], category = "doctor") =>
  fees.find((f) => f.category === category)?.price;

export const getFinalFeeInfo = (fees = [], category = "doctor") => {
  // 1. Guard against empty or invalid fees array
  if (!fees || !Array.isArray(fees) || fees.length === 0) {
    return { 
      finalFee: 0, 
      hasDiscount: false, 
      isFree: true, 
      label: "Complimentary" 
    };
  }

  // 2. Find the specific category (case-insensitive) or fallback to the first fee
  const feeObj = fees.find((f) => f.category?.toLowerCase() === category.toLowerCase()) || fees[0];

  // 3. Destructure with default values to prevent "undefined" errors
  const { price = 0, discountPercent = 0 } = feeObj;

  // 4. Handle Free/Zero price cases
  if (price === 0) {
    return { 
      finalFee: 0, 
      hasDiscount: false, 
      isFree: true, 
      label: "Complimentary" 
    };
  }

  // 5. Calculate Discounted Price
  if (discountPercent > 0) {
    return {
      finalFee: Math.round(price - (price * discountPercent) / 100),
      hasDiscount: true,
      originalPrice: price,
      isFree: false
    };
  }

  return { 
    finalFee: price, 
    hasDiscount: false, 
    isFree: false 
  };
};

export const getSeatStatus = (
  totalSeats = 0,
  registeredSeats = 0,
  threshold = 10
) => {
  const spotsLeft = Math.max(totalSeats - registeredSeats, 0);

  return {
    spotsLeft,
    isFull: spotsLeft === 0,
    isAlmostFull: spotsLeft > 0 && spotsLeft <= threshold,
    isLimitedSeats: spotsLeft <= (threshold/2),
  };
};

export const getKeySpeakerLabel = (speakers = []) => {
  if (!Array.isArray(speakers) || speakers.length === 0) {
    return "N/A";
  }

  const keySpeakers = speakers.filter((s) => s.isKeySpeaker);

  if (keySpeakers.length > 2) {
    return "Multiple Speakers";
  }

  const finalSpeakers =
    keySpeakers.length > 0 ? keySpeakers : speakers;

  return finalSpeakers.map((s) => s.name).join(", ");
};

export const getUniqueKeySpeakersFromSchedule = (schedule) => {
  if (!schedule || !Array.isArray(schedule)) return [];

  const uniqueSpeakersMap = new Map();

  schedule.forEach((session) => {
    // Check if the session has a speaker array
    if (session.speaker && Array.isArray(session.speaker)) {
      session.speaker.forEach((sp) => {
        // We only want Key Speakers with valid names
        if (sp?.isKeySpeaker && sp?.name) {
          const normalizedName = sp.name.trim().toLowerCase();
          
          // Only add if we haven't seen this speaker name before
          if (!uniqueSpeakersMap.has(normalizedName)) {
            uniqueSpeakersMap.set(normalizedName, {
              ...sp,
              name: sp.name.trim() // Keep original casing for display
            });
          }
        }
      });
    }
  });

  // Convert the Map values back into an array
  return Array.from(uniqueSpeakersMap.values());
};

export const getDiscountedFee = ({ price = 0, discountPercent = 0 }) => {
  if (price === 0) return 0;
  return discountPercent > 0 ? Math.round(price - (price * discountPercent) / 100) : price;
};

export const toDateTimestamp = (date) => {
  if (!date) return null;
  return new Date(date).getTime();
};

export const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
});

export const suggestEndTime = (startTime) => {
  if (!startTime) return "";

  // Split hours and minutes
  const [hours, minutes] = startTime.split(':').map(Number);
  
  // Create a date object for easy math
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  
  // Add 1 hour
  date.setHours(date.getHours() + 1);
  
  // Format back to HH:mm (24h format for HTML5 time inputs)
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  
  return `${h}:${m}`;
};

export const calculateDuration = (start, end) => {
  if (!start || !end) return null;

  // Helper to convert any time string (24h or 12h) to total minutes
  const getMinutes = (timeStr) => {
    // 1. Remove AM/PM and split
    const parts = timeStr.toLowerCase().replace(/[ap]m/g, '').trim().split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    // 2. Adjust for 12-hour format if PM is present
    if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
    if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const startMins = getMinutes(start);
  const endMins = getMinutes(end);
  
  // If the event crosses midnight, handle the negative difference
  let diff = endMins - startMins;
  if (diff < 0) diff += 1440; // Adds 24 hours in minutes

  if (isNaN(diff)) return null;
  if (diff < 60) return `${diff} mins`;
  
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hrs`;
};
export const formatTo12Hr = (timeStr) => {
  if (!timeStr) return "";

  // 1. Check if "AM" or "PM" is already present (case-insensitive)
  if (/[ap]m/i.test(timeStr)) {
    return timeStr.toUpperCase(); // Return as is, just standardized to uppercase
  }

  // 2. Handle standard "HH:mm" strings
  const [hours, minutes] = timeStr.split(':');
  if (!hours || !minutes) return timeStr; // Fallback for invalid formats

  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedH = h % 12 || 12;
  
  // Return formatted string with leading zero for minutes if needed
  return `${formattedH}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};