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

export const getUniqueKeySpeakersFromSchedule = (schedule = []) => {
  // Use a Map to ensure uniqueness by speaker name
  const speakerMap = new Map();
  console.log('schedule', schedule);
  schedule.forEach((item) => {
    // Check if the schedule item has a speaker array
    if (Array.isArray(item.speaker)) {
      item.speaker.forEach((person) => {
        // Filter for Key Speakers with valid names
        if (person.isKeySpeaker && person.name) {
          if (!speakerMap.has(person.name)) {
            speakerMap.set(person.name, person);
          }
        }
      });
    }
  });
  console.log('speakers:',Array.from(speakerMap.values()))

  return Array.from(speakerMap.values());
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
