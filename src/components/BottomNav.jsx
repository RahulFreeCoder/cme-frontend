import { Home, LayoutDashboard, User, ClipboardCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {ROLES } from '../pages/constants';

const BottomNav = ({ userRole }) => {
  const location = useLocation();
  const isOrganizer = userRole === ROLES.ORGANIZER || userRole === ROLES.ADMIN;

  // Don't show on desktop
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center pb-2 pt-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
        <Home size={20} />
        <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
      </Link>

      {isOrganizer && (
        <>
          <Link to="/organizer" className={`flex flex-col items-center gap-1 ${location.pathname === '/organizer' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter">My CMEs</span>
          </Link>
          <Link to="/organizer/registrations" className={`flex flex-col items-center gap-1 ${location.pathname.includes('registrations') ? 'text-indigo-600' : 'text-slate-400'}`}>
            <ClipboardCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Check-In</span>
          </Link>
        </>
      )}
    </nav>
  );
};

export default BottomNav;