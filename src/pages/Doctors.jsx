import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/users/usersSlice";
import DoctorCard from "../components/DoctorCard";
import DoctorProfile from "../components/DoctorProfile";

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.users);

  const handleDoctorView = (doctor) => {
    console.log('Doctor Selected', doctor);
    setSelectedDoctor(doctor);
  };

  useEffect(() => {
    dispatch(getUsers());
  }, []); // dispatch does NOT need to be here

   // Show profile detail page if a doctor is selected
  const showDoctorProfile = useMemo(() => {
    if (selectedDoctor) {
    return (
      <DoctorProfile 
        doctor={selectedDoctor} 
        onBack={() => setSelectedDoctor(null)} 
      />
    );
  }
},[selectedDoctor]);

  return (
    <main className="container mt-6">
      {loading && <div>Loading Doctors...</div>}

      {selectedDoctor ?      
        <section>
          {showDoctorProfile}
        </section> : 
        <section className="events-grid">
          {users.map((u) => (
            <DoctorCard
              key={u.id}
              doctor={u}                // Keep this only if expects a doctor prop
              onViewProfile={handleDoctorView}
            />
          ))}
        </section>
      }
      

    </main>
  );
}
