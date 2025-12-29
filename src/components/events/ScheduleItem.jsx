import React from "react";
import { User } from "lucide-react";
import { dateFormatter, formatTimeRange , getKeySpeakerLabel} from "../utils/dataFormatter";

const ScheduleItem = React.memo(({ item }) => {
  return (
    <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
      <div className="bg-blue-500 text-white rounded-lg px-3 py-2 min-w-[100px] text-center">
        <p>{dateFormatter(item.date)}</p>
        <p className="text-blue-100">{formatTimeRange(item.time)}</p>
      </div>
      <div>
        <p className="text-gray-900 mb-1">{item.topics}</p>
        <p className="text-gray-600 flex items-center gap-1">
          <User className="w-4 h-4" />
          {getKeySpeakerLabel(item.speakers)}
        </p>
      </div>
    </div>
  );
});

export default ScheduleItem;
