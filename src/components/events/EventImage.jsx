import { useState } from "react";
import { ImageIcon } from "lucide-react";

const CATEGORY_FALLBACKS = {
  Pediatrics: "/fallbacks/pediatrics.jpg",
  Cardiology: "/fallbacks/cardiology.jpg",
  Dermatology: "/fallbacks/dermatology.jpg",
};

export default function EventImage({ src, category }) {
  const [error, setError] = useState(false);

  const fallback =
    CATEGORY_FALLBACKS[category] || "/fallbacks/default.jpg";

  if (!src || error) {
    return (
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-blue-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setError(true)}
      className="h-48 w-full object-cover"
    />
  );
}
