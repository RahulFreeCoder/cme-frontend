import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Use useLocation for better reactivity
import { Bell, User, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import CmeLogo from "./ui/CmeLogo";

export default function Navbar({ onLoginClick, onLogoutclick }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Organizer", to: "/organizer", roles: ["ORGANIZER", "ADMIN"] },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="transition-transform group-hover:scale-110 duration-300">
            <CmeLogo />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-black text-slate-800 uppercase tracking-tighter leading-none block">
              Medical Events
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Platform
            </span>
          </div>
        </Link>

        {/* 2. Central Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(user?.userRole))
            .map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`relative text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-[22px] left-0 w-full h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]" />
                  )}
                </Link>
              );
            })}
        </nav>

        {/* 3. Action Area */}
        <div className="flex items-center gap-5">
          {user && (
            <button className="group relative p-2 rounded-xl bg-slate-50 hover:bg-blue-50 transition-all border border-slate-100">
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-blue-600 rounded-full ring-2 ring-white animate-pulse"></span>
            </button>
          )}

          {!user ? (
            <button
              className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
              onClick={onLoginClick}
            >
              Sign In
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              {/* Profile Trigger */}
              <button
                onClick={() => setOpen((v) => !v)}
                className={`flex items-center gap-2 p-1 pr-3 rounded-full border transition-all ${
                  open ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200 hover:border-blue-200"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-white flex items-center justify-center text-xs font-black">
                  {user.firstName.charAt(0)}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {/* Enhanced Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-3 bg-white shadow-2xl shadow-blue-900/10 rounded-2xl w-60 p-2 border border-slate-100 animate-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-50 mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={12} className="text-blue-600" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logged In</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user.prefix} {user.firstName} {user.lastName}
                    </p>
                  </div>

                  <DropdownItem to="/profile" icon={<User size={16} />} label="My Profile" />
                  <DropdownItem to="/settings" icon={<Settings size={16} />} label="Settings" />
                  
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => { setOpen(false); onLogoutclick(); }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
    >
      <span className="opacity-70">{icon}</span>
      {label}
    </Link>
  );
}