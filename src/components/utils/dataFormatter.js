export const dateFormatter = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

export const formatTimeRange = (start, end) => {
  if (!start) return "";

  if (!end) {
    return formatHHMM(start);
  }

  return `${formatHHMM(start)} - ${formatHHMM(end)}`;
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
  // const feeObj = fees.find((f) => f.category.toLowerCase() === category);
  // if (!feeObj) return null;
  const feeObj = fees[0];
  const { price, discountPercent = 0 } = feeObj;

  if (price === 0) {
    return { finalFee: 0, hasDiscount: false };
  }

  if (discountPercent > 0) {
    return {
      finalFee: Math.round(price - (price * discountPercent) / 100),
      hasDiscount: true,
    };
  }

  return { finalFee: price, hasDiscount: false };
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

export const getUniqueKeySpeakersFromSchedule = (speakers = []) => {
  if (!Array.isArray(speakers)) return [];

  const speakerMap = new Map();
  speakers?.forEach((speaker) => {
      if (speaker.isKeySpeaker && speaker.name) {
        if (!speakerMap.has(speaker.name)) {
          speakerMap.set(speaker.name, speaker);
        }
      }
  });

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
