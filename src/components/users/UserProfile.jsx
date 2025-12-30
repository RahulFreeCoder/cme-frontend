import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserInfoCard from "./UserInfoCard";
import PaymentHistory from "./PaymentHistory";
import { 
  User, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  Settings,
  LogOut
} from "lucide-react";

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);   
  const [activeTab, setActiveTab] = useState("profile");  
  /* Consistency: Using the same collapsed state logic as the Dashboard */
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      
      {/* SIDEBAR: Collapsible Account Navigation */}
      <aside
        className={`bg-white border-r border-slate-200 hidden md:flex flex-col transition-all duration-500 ease-in-out sticky top-0 h-screen
          ${collapsed ? "w-20" : "w-64"} 
        `} // Consistency: Using the same width transitions
      >
        {/* Header Section */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          {!collapsed && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Account
                </h2>
              </div>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                {user?.firstName}
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <SidebarTab
            label="Profile Info"
            icon={<User />}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            collapsed={collapsed}
          />
          <SidebarTab
            label="Payments"
            icon={<CreditCard />}
            active={activeTab === "payment"}
            onClick={() => setActiveTab("payment")}
            collapsed={collapsed}
          />
        </nav>

        {/* Sidebar Footer matching Dashboard */}
        <div className="p-4 border-t border-slate-50">
           <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-2 rounded-xl bg-slate-50 border border-slate-100`}>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Settings size={16} />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-[10px] font-bold text-slate-800 leading-none">Security</p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">Privacy & Safety</p>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-8 overflow-auto max-w-5xl mx-auto w-full">
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "profile" && user && (
                <UserInfoCard selectedUser={user} />
              )}

              {activeTab === "payment" && user?.email && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <PaymentHistory email={user.email} />
                </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Sidebar Tab Component ---------------- */

function SidebarTab({ label, icon, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }
        ${collapsed ? "justify-center" : "gap-3"}`} // Consistency: Center icon when collapsed
    >
      {/* Active indicator pill */}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
      )}

      <span className={`${active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"} transition-colors`}>
        {React.cloneElement(icon, { size: 20 })}
      </span>

      {!collapsed && (
        <span className="truncate tracking-tight">{label}</span>
      )}

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </button>
  );
}