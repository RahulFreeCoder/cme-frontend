import React from "react";
import { CheckCircle, XCircle, Star, Info } from "lucide-react";

export default function AdditionalInfo({ info = [] }) {
  if (!info.length) return null;

  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h3 className="mb-4">Important Information</h3>
      <ul className="space-y-2">
        {info.map((item, idx) => {
          // Decide icon based on keywords (optional)
          let Icon = Info; // default icon
          if (item.toLowerCase().includes("certificate")) Icon = CheckCircle;
          else if (item.toLowerCase().includes("no refund")) Icon = XCircle;

          return (
            <li key={idx} className="flex gap-2 items-center">
              <Icon className="text-blue-500 w-5 h-5 shrink-0" />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
