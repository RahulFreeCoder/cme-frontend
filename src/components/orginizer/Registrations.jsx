import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";
import { Search, Users, CheckCircle2, ChevronDown, Calendar, Hash } from "lucide-react";

// Core Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Registrations() {
  const gridRef = useRef();
  
  // 1. Redux State: Pulling full event objects to get titles
  const allCmeIds = useSelector((s) => s.organizer.cmeIds || []);
  const rawEventsFromRedux = useSelector((s) => s.events.events || []);

  // 2. DERIVED STATE (Memoized filtering)
  const filteredEvents = useMemo(() => {
    // Return empty if IDs or events haven't loaded yet
    if (!allCmeIds.length || !rawEventsFromRedux.length) return [];
    
    return rawEventsFromRedux.filter((event) => 
      allCmeIds.includes(event.cmeId) || allCmeIds.includes(event.id)
    );
  }, [allCmeIds, rawEventsFromRedux]);

  const [selectedCmeId, setSelectedCmeId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

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
    const updatedRegistration = { ...row, isCMEAttended: !row.isCMEAttended };

    setRegistrations((prev) => 
      prev.map((r) => (r.id === row.id ? updatedRegistration : r))
    );

    try {
      const payload = {
        cmeId: row.cmeId,
        emailId: row.emailId,
        isCMEAttended: !row.isCMEAttended,
        transactionId : row.transactionId || "0" 
      };

      await axiosInstance.patch("/api/CMERegistration/UpdateCMERegistration", payload);
      toast.success(updatedRegistration.isCMEAttended ? "Marked Present" : "Marked Absent");
    } catch (error) {
      setRegistrations((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      toast.error("Sync failed.");
    }
  }, []);

  /* ------------------------------------------------------------------- */
  /* 4. Column Defs                                                     */
  /* ------------------------------------------------------------------- */
  const columnDefs = useMemo(() => [
    { 
      field: "emailId", 
      headerName: "Participant", 
      flex: 1, 
      minWidth: 250,
      cellRenderer: (p) => (
        <div className="flex flex-col justify-center h-full">
           <span className="text-slate-900 font-bold text-xs">{p.value}</span>
        </div>
      )
    },
    {
      headerName: "Attendance",
      field: "isCMEAttended",
      width: 200,
      cellRenderer: (p) => (
        <div className="flex items-center h-full">
          <span className={`px-3 py-1 rounded-full text-[0.9rem] font-black uppercase border transition-all ${
            p.value ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-orange-600 border-slate-100"
          }`}>
            {p.value ? "Present" : "Pending"}
          </span>
        </div>
      )
    },
    {
      headerName: "Action",
      width: 200,
      cellRenderer: (p) => (
        <button 
          onClick={() => toggleAttendance(p.data)} 
          className={`w-full py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            p.data.isCMEAttended 
            ? "bg-white border-rose-100 text-rose-500 hover:bg-rose-50" 
            : "bg-slate-900 text-white hover:bg-indigo-600 border-transparent shadow-md"
          }`}
        >
          {p.data.isCMEAttended ? "Undo" : "Check-In"}
        </button>
      )
    }
  ], [toggleAttendance]);

  return (
    <div className="p-4 md:p-10 bg-[#fcfdfe] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. SELECTOR CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Attendance Management</h2>
            
            <div className="relative group">
              <label className="absolute -top-2 left-4 px-2 bg-white text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] z-10">
                Select Active Event
              </label>
              <select
                value={selectedCmeId || ""}
                onChange={(e) => { setSelectedCmeId(e.target.value); setSearchText(""); }}
                className="w-full pl-6 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Search by Title or ID...</option>
                {filteredEvents?.map((ev) => (
                  <option key={ev.cmeId} value={ev.cmeId}>
                    [{ev.cmeId}] — {ev.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>

        {selectedCmeId && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* 2. TOOLBAR: Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by email or ID..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                />
              </div>
              
              <div className="flex gap-3">
                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                   <Users size={16} className="text-indigo-500" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance</span>
                      <span className="text-xs font-black text-slate-900">
                        {registrations.filter(r => r.isCMEAttended).length} / {registrations.length} Present
                      </span>
                   </div>
                </div>
              </div>
            </div>

            {/* 3. GRID CONTAINER */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-4">
                <div className="ag-theme-alpine w-full h-[550px] custom-attendance-grid">
                  <AgGridReact
                    ref={gridRef}
                    rowData={registrations}
                    columnDefs={columnDefs}
                    quickFilterText={searchText}
                    rowClassRules={{ 'bg-emerald-50/30': (p) => p.data.isCMEAttended }}
                    defaultColDef={{ sortable: true, resizable: true }}
                    rowHeight={65}
                    pagination={true}
                    paginationPageSize={10}
                    loadingOverlayComponentParams={{ loadingMessage: 'Retrieving Registrations...' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedCmeId && (
          <div className="py-32 flex flex-col items-center justify-center opacity-30">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={32} />
             </div>
             <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Select an event to begin check-in</p>
          </div>
        )}
      </div>

      <style>{`
        .custom-attendance-grid .ag-root-wrapper { border: none !important; }
        .custom-attendance-grid .ag-header { background-color: white !important; border-bottom: 2px solid #f8fafc !important; }
        .custom-attendance-grid .ag-header-cell-label { color: #94a3b8 !important; font-size: 10px !important; text-transform: uppercase !important; font-weight: 900 !important; letter-spacing: 0.1em !important; }
        .custom-attendance-grid .ag-row { border-bottom: 1px solid #f8fafc !important; transition: background-color 0.2s; }
        .custom-attendance-grid .ag-row-hover { background-color: #f1f5f9 !important; }
        .custom-attendance-grid .ag-cell { display: flex; align-items: center; border: none !important; }
        .bg-emerald-50\\/30 { background-color: rgba(16, 185, 129, 0.05) !important; }
      `}</style>
    </div>
  );
}