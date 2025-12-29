import {useState } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  CalendarPlus,
  ListChecks,
  CreditCard,
  ChevronLeft, 
  ChevronRight,
} from "lucide-react";

export default function OrganizerDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log("OrganizerDashboard mounted");
  return (
    <div className="min-h-[calc(100vh-50px)] bg-gray-50 flex">

       {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-300
            ${collapsed ? "w-16" : "w-50"}
          `}
        >
        <div className="p-5 border-b flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-blue-600">
                Organizer Panel
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {user?.prefix} {user?.firstName}
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-1.5 rounded hover:bg-gray-100"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <SidebarLink
            to="/organizer"
            label="My CMEs"
            icon={<LayoutDashboard size={collapsed ? 22 : 18} />}
            end
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/add"
            label="Add CME"
            icon={<CalendarPlus size={collapsed ? 22 : 18} />}
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/registrations"
            label="Registrations"
            icon={<ListChecks size={collapsed ? 22 : 18} />}
            collapsed={collapsed}
          />

          <SidebarLink
            to="/organizer/payments"
            label="Payments"
            icon={<CreditCard size={collapsed ? 22 : 18} />}
            collapsed={collapsed}
          />
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto">
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
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center ${
          collapsed ? "justify-center" : "gap-3"
        } px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <span
        className={collapsed ? "scale-125" : ""}
      >
        {icon}
      </span>

      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}


