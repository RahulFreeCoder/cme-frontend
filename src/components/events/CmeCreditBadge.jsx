import { GraduationCap  } from "lucide-react";
export default function CmeCreditBadge({ credits }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 backdrop-blur-md">
      <GraduationCap className="w-5 h-5 text-blue-600" />
      <div>
        <p className="text-xs text-gray-500">Credit</p>
        <p className="text-blue-700 font-semibold">{credits}</p>
      </div>
    </div>
  );
}