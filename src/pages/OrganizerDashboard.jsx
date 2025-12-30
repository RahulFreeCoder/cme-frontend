import React, { useState } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  CreditCard,
  ChevronLeft, 
  ChevronRight,
  User as UserIcon
} from "lucide-react";

export default function OrganizerDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex"> {/* Modern soft gray background */}

       {/* Sidebar */}
        <aside
          className={`bg-white border-r border-slate-200 hidden md:flex flex-col transition-all duration-500 ease-in-out sticky top-0 h-screen
            ${collapsed ? "w-20" : "w-64"}
          `}
        >
        {/* Profile/Header Section */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          {!collapsed && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Organizer
                </h2>
              </div>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                {user?.prefix} {user?.firstName}
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <SidebarLink
            to="/organizer"
            label="My CMEs"
            icon={<LayoutDashboard />}
            end
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/add"
            label="Add CME"
            icon={<CalendarPlus />}
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/registrations"
            label="Registrations"
            icon={<ListChecks />}
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/payments"
            label="Payments"
            icon={<CreditCard />}
            collapsed={collapsed}
          />
        </nav>

        {/* Sidebar Footer - Useful for Logout/Settings */}
        <div className="p-4 border-t border-slate-50">
           <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-2 rounded-xl bg-slate-50 border border-slate-100`}>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <UserIcon size={16} />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <p className="text-[10px] font-bold text-slate-800 leading-none">Settings</p>
                  <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">Manage Account</p>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-8 overflow-auto max-w-[1400px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ---------------- Sidebar Link Component ---------------- */

function SidebarLink({ to, label, icon, end, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }
        ${collapsed ? "justify-center" : "gap-3"}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator pill */}
          {isActive && (
            <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
          )}

          <span className={`${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"} transition-colors duration-200`}>
             {/* Clone element to force size consistency */}
             {React.cloneElement(icon, { size: 20 })}
          </span>

          {!collapsed && (
            <span className="truncate tracking-tight font-bold">{label}</span>
          )}

          {/* Tooltip for collapsed mode */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}