import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import CmeLogo from "./ui/CmeLogo";

export default function Navbar({onLoginClick, onLogoutclick}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
    { name: "Organizer", to: "/organizer", roles: ["ORGANIZER", "ADMIN"] }
  ];

  const activePath = window.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-blue-100">
      <div className="max-w-[1400px] mx-auto px-5 h-15 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <CmeLogo  />
          <span className="text-md font-semibold text-gray-800 hidden sm:block">
            Medical Events & Orgnization
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter((item) => {
              // public route
              if (!item.roles) return true;

              // role protected
              return item.roles.includes(user?.userRole);
            })
            .map((item) => {
              const isActive = activePath === item.to;

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`
                    relative text-sm font-medium transition
                    ${isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}
                  `}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}

        </nav>


        {/* Actions */}
        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Notification (only when logged in) */}
          {user && (
            <button className="relative p-1.5 rounded-full hover:bg-blue-50 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          )}

          {/* Auth */}
          {!user ? (
            /* Login Button */
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg
                bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
              onClick={onLoginClick}
            >
              Login
            </button>
          ) : (
            /* Profile Dropdown */
            <div className="relative" ref={menuRef}>
              <div
                className="w-8 h-8 rounded-full bg-blue-100 text-blue-700
                  flex items-center justify-center text-sm font-semibold cursor-pointer"
                onClick={() => setOpen((v) => !v)}
              >
                {user.firstName.charAt(0).toUpperCase()}
              </div>

              {open && (
                <div
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-md
                    w-44 p-1 border border-gray-100 z-50"
                >
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Signed in as <br />
                    <span className="font-medium text-gray-800">
                      {user.prefix} {user.firstName} {user.lastName}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded"
                  >
                    Settings
                  </Link>

                  <button
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    onClick={() => {
                      setOpen(false);
                      onLogoutclick();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          )}

        </div>

      </div>
    </header>
  );
}
