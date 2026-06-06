import React,  {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Doctors from './pages/Doctors';
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import { logout } from "./redux/auth/authSlice";
import { ROLES } from "./pages/constants";
import AddCME from "./components/orginizer/AddCme";
import MyCme from "./components/orginizer/MyCme";
import UserProfile from "./components/users/UserProfile";
import { getUpcomingEvents, getEventStats } from "./redux/events/eventsSlice";
import Registrations from "./components/orginizer/Registrations";
import Payments from "./components/orginizer/Payments";
import BottomNav from './components/BottomNav';


export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    console.log("isAuthenticsted: ", isAuthenticated)
    // Check if user is logged in
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
   };
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  }
  useEffect(() => {
    const now = new Date().toISOString();
    dispatch(getUpcomingEvents(now));
  }, [dispatch]);

  return (
    <div>
      <Navbar onLoginClick={handleLogin} onLogoutclick={handleLogout}/>
      <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* ORGANIZER LAYOUT ROUTE */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyCme />} />
          <Route path="add" element={<AddCME />} />
          <Route path="registrations" element={<Registrations/>} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#333",
          },
        }}
      />
    {isAuthenticated && <BottomNav userRole={user?.userRole} />}
    </div>
  );
}
