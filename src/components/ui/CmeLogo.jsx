import { GraduationCap, Plus } from "lucide-react";

// export default function CmeLogo({ size = "md" }) {
//   const sizes = {
//     sm: "text-sm gap-2 px-3 py-1.5",
//     md: "text-base gap-3 px-4 py-2",
//     lg: "text-lg gap-3 px-5 py-3",
//   };

//   return (
//     <div
//       className={`inline-flex items-center rounded-full bg-gradient-to-r 
//       from-blue-600 to-indigo-600 text-white shadow-md ${sizes[size]}`}
//     >
//       <div className="relative">
//         <GraduationCap className="w-5 h-5" />
//         <Plus className="w-3 h-3 absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-[1px]" />
//       </div>
//       <span className="font-semibold tracking-wide">CME</span>
//     </div>
//   );
// }

const CmeLogo = ({ className }) => (
  <svg 
    viewBox="0 0 192 192" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* Heart Shape */}
    <path 
      d="M96 170c-5-5-80-45-80-95 0-25 20-45 45-45 15 0 28 8 35 20 7-12 20-20 35-20 25 0 45 20 45 45 0 50-75 90-80 95z" 
      fill="#FF0000" 
    />
    
    {/* Medical Cross */}
    <rect x="86" y="60" width="20" height="50" fill="white" rx="2" />
    <rect x="71" y="75" width="50" height="20" fill="white" rx="2" />
    
    {/* CME Text Path (Simplified) */}
    <text 
      x="96" 
      y="145" 
      fill="white" 
      fontSize="24" 
      fontWeight="900" 
      fontFamily="Arial, sans-serif" 
      textAnchor="middle"
      style={{ letterSpacing: '1px' }}
    >
      CME
    </text>
    
    {/* Green Leaf Detail */}
    <path 
      d="M85 35c0-10 11-20 11-20s11 10 11 20-11 15-11 15-11-5-11-15z" 
      fill="#CCFF88" 
    />
  </svg>
);

export default CmeLogo;