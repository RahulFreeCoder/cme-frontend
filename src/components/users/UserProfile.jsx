// src/pages/UserProfile.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserInfoCard from "./UserInfoCard";
import PaymentHistory from "./PaymentHistory";

export default function UserProfile() {

  const { user } = useSelector((state) => state.auth);   


  const [activeTab, setActiveTab] = useState("profile");  


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex border-b mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 -mb-px focus:outline-none ${
            activeTab === "profile"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "border-b-2 border-transparent text-gray-700 hover:text-indigo-600"
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 -mb-px focus:outline-none ${
            activeTab === "payment"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "border-b-2 border-transparent text-gray-700 hover:text-indigo-600"
          }`}
        >
          Payment History
        </button>
      </div>


      <div className="space-y-6">
        {activeTab === "profile" && user && (
          <UserInfoCard selectedUser={user} />
        )}

        {activeTab === "payment" && user?.email && (
          <PaymentHistory email={user.email} />
        )}
      </div>
    </div>
  );
}
