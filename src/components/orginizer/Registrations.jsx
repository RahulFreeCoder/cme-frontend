import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";

// Core Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Registrations() {
  const gridRef = useRef();
  
  // 1. Redux State
  const allCmeIds = useSelector((s) => s.organizer.cmeIds);

  const [selectedCmeId, setSelectedCmeId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(""); // 🔍 Search State

  /* ------------------------------------------------------------------- */
  /* 2. Fetching Logic                                                  */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedCmeId) {
      setRegistrations([]);
      return;
    }

    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/CMERegistration/GetCMERegistrationByUserByCME", {
          params: { cmeId: selectedCmeId },
        });
        setRegistrations(response.data || []);
      } catch (err) {
        toast.error("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [selectedCmeId]);

  /* ------------------------------------------------------------------- */
  /* 3. Toggle Attendance                                               */
  /* ------------------------------------------------------------------- */
  const toggleAttendance = useCallback(async (row) => {
    // 1. Create the updated state for local UI (optimistic update)
    const updatedRegistration = { ...row, isCMEAttended: !row.isCMEAttended };

    setRegistrations((prev) => 
      prev.map((r) => (r.id === row.id ? updatedRegistration : r))
    );

    try {
      // 2. Extract only the required fields for the API payload
      const payload = {
        cmeId: row.cmeId,
        emailId: row.emailId,
        isCMEAttended: !row.isCMEAttended,
        transactionId : "0" // default we dont need this field but backend expect some value
      };

      // 3. Send only the specific payload to the backend
      await axiosInstance.patch("/api/CMERegistration/UpdateCMERegistration", payload);
      
      toast.success(updatedRegistration.isCMEAttended ? "Marked Present" : "Marked Absent");
    } catch (error) {
      // Rollback to original row state if API fails
      setRegistrations((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      toast.error("Sync failed.");
    }
  }, []);
  /* ------------------------------------------------------------------- */
  /* 4. Column Defs                                                     */
  /* ------------------------------------------------------------------- */
  const columnDefs = useMemo(() => [
    { 
      field: "id", 
      headerName: "User ID", 
      width: 100,
      cellStyle: { color: '#64748b', fontSize: '12px' } 
    },
    { 
      field: "emailId", 
      headerName: "Participant Email", 
      flex: 1, 
      minWidth: 200,
      cellStyle: { fontWeight: '600' }
    },
    {
      headerName: "Status",
      field: "isCMEAttended",
      width: 150,
      cellRenderer: (p) => (
        <div className="flex items-center h-full">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
            p.value ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
          }`}>
            {p.value ? "✓ Present" : "○ Pending"}
          </span>
        </div>
      )
    },
    {
      headerName: "Action",
      width: 160,
      cellRenderer: (p) => (
        <button 
          onClick={() => toggleAttendance(p.data)} 
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            p.data.isCMEAttended ? "bg-white border-rose-200 text-rose-500" : "bg-indigo-600 text-white"
          }`}
        >
          {p.data.isCMEAttended ? "Undo" : "Mark Present"}
        </button>
      )
    }
  ], [toggleAttendance]);

  return (
    <div className="p-8 bg-[#fcfdfe] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 1. CME ID Chips */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-800 mb-4 text-center">Select CME Event</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {allCmeIds?.map((id) => (
              <button
                key={id}
                onClick={() => { setSelectedCmeId(id); setSearchText(""); }} // Clear search on CME change
                className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  selectedCmeId === id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-500"
                }`}
              >
                ID: {id}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Search & Stats Toolbar */}
        {selectedCmeId && (
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search by User ID or Email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
              />
            </div>
            
            <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold text-sm border border-indigo-100 shadow-sm">
              Present: {registrations.filter(r => r.isCMEAttended).length} / {registrations.length}
            </div>
          </div>
        )}

        {/* 3. Attendance Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          {!selectedCmeId ? (
            <div className="py-24 text-center text-slate-400 font-medium">
              Select an Event ID above to load participants
            </div>
          ) : (
            <div className="p-4">
              <div className="ag-theme-alpine w-full h-[500px] custom-attendance-grid">
                <AgGridReact
                  ref={gridRef}
                  rowData={registrations}
                  columnDefs={columnDefs}
                  quickFilterText={searchText} // 🔍 Connects search input to Grid
                  rowClassRules={{ 'bg-emerald-50/20': (p) => p.data.isCMEAttended }}
                  defaultColDef={{ sortable: true, resizable: true }}
                  rowHeight={60}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-attendance-grid .ag-root-wrapper { border: none !important; }
        .custom-attendance-grid .ag-header { background-color: white !important; border-bottom: 2px solid #f8fafc !important; }
        .custom-attendance-grid .ag-header-cell-label { color: #94a3b8 !important; font-size: 11px !important; text-transform: uppercase !important; font-weight: 800 !important; }
        .custom-attendance-grid .ag-row { border-bottom: 1px solid #f1f5f9 !important; }
        .custom-attendance-grid .ag-cell { display: flex; align-items: center; border: none !important; }
        .bg-emerald-50\\/20 { background-color: rgba(16, 185, 129, 0.05) !important; }
      `}</style>
    </div>
  );
}