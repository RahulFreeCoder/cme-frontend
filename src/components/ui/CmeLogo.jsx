import { GraduationCap, Plus } from "lucide-react";

export default function CmeLogo({ size = "md" }) {
  const sizes = {
    sm: "text-sm gap-2 px-3 py-1.5",
    md: "text-base gap-3 px-4 py-2",
    lg: "text-lg gap-3 px-5 py-3",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r 
      from-blue-600 to-indigo-600 text-white shadow-md ${sizes[size]}`}
    >
      <div className="relative">
        <GraduationCap className="w-5 h-5" />
        <Plus className="w-3 h-3 absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-[1px]" />
      </div>
      <span className="font-semibold tracking-wide">CME</span>
    </div>
  );
}
