import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import {UserStar} from "lucide-react";

const SpeakerCard = React.memo(({ speaker }) => {
  return (
    <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <ImageWithFallback
        src={UserStar }
        alt={speaker.name.charAt(0).toLowerCase()}
        className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
      />
      <div>
        <p className="text-gray-900">{speaker.name}</p>
        <p className="text-blue-600 mb-2">{speaker.designation}</p>
        <p className="text-gray-600">{speaker.details}</p>
      </div>
    </div>
  );
});

export default SpeakerCard;
