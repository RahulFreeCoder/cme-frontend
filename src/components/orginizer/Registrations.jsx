import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axiosInstance from "../../services/axiosinstance";
import notify from '../ui/notify';
import { Search, Users, CheckCircle2, ChevronDown, Calendar, Hash } from "lucide-react";

// Core Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Registrations() {
  const gridRef = useRef();

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activeReg, setActiveReg] = useState(null); // Registration being edited
  const [certId, setCertId] = useState("");
  const [selectedCmeId, setSelectedCmeId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  // 1. Redux State: Pulling full event objects to get titles
  const allCmeIds = useSelector((s) => s.organizer.cmeIds || []);
  const rawEventsFromRedux = useSelector((s) => s.events.events || []);
  console.log('Registrations: ', registrations);
  // 2. DERIVED STATE (Memoized filtering)
  const filteredEvents = useMemo(() => {
    // Return empty if IDs or events haven't loaded yet
    if (!allCmeIds.length || !rawEventsFromRedux.length) return [];
    
    return rawEventsFromRedux.filter((event) => 
      allCmeIds.includes(event.cmeId) || allCmeIds.includes(event.id)
    );
  }, [allCmeIds, rawEventsFromRedux]);



  const [certForm, setCertForm] = useState({
    certificateNumber: "",
    certificateName: "",
    creditPoints: 0,
    issuedBy: "",
    issuedDate: new Date().toISOString(),
    validTill: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    certificateUrl: ""
  });

  const handleSaveCertificate = async () => {
    // Guard: Don't allow saving if not marked as present
    if (!activeReg?.isCMEAttended) {
      notify.error("Participant must be checked-in first");
      return;
    }

    try {
      const payload = {
        ...activeReg,
        cmeCertificateDetails: [certForm] 
      };

      await axiosInstance.patch("/api/CMERegistration/UpdateCMERegistration", payload);
      
      setRegistrations(prev => prev.map(r => r.id === activeReg.id ? payload : r));
      notify.success("Certificate issued successfully");
      setIsCertModalOpen(false);
    } catch (error) {
      notify.error("Failed to update certificate");
    }
  };

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
        setRegistrations(response.data.data || []);
      } catch (err) {
        setRegistrations([]);
        const errorData = err.response?.data;
    
        if (err.response?.status === 404) {
          // Instead of an error toast, we show an informative info toast
          notify.error(errorData?.message || "No registrations found for this event");
        } else {
          // For actual system errors (500, network failure, etc.)
          notify.error("Failed to connect to the server");
        }
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

      await axiosInstance.put("/api/CMERegistration/UpdateCMERegistration", payload);
      notify.success(
        updatedRegistration.isCMEAttended ? "Marked Present" : "Marked Absent",
        `Participant: ${row.emailId}`
      );
    } catch (error) {
      setRegistrations((prev) => prev.map((r) => (r.id === row.id ? row : r)));
      notify.error("Sync failed.");
    }
  }, []);

  /*---------------------------------------------------------------------*/
  /* save certificate */
  /*-----------------*/
  const saveCertificate = async () => {
    try {
      const payload = {
        ...activeReg,
        certificateId: certId,
        issueDate: new Date().toISOString()
      };
      
      // Replace with your actual endpoint
      await axiosInstance.patch("/api/CMERegistration/UpdateCertificate", payload);
      
      // Update local state grid
      setRegistrations(prev => prev.map(r => r.id === activeReg.id ? payload : r));
      
      notify.success("Certificate Details Saved");
      setIsCertModalOpen(false);
    } catch (error) {
      notify.error("Failed to save certificate");
    }
  };


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
          <div className={`
            relative flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300
            ${p.value 
              ? "bg-emerald-50/50 text-emerald-700 border-emerald-200 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]" 
              : "bg-slate-50 text-slate-500 border-slate-200 shadow-sm"
            }
          `}>
            {/* Small pulsing dot indicator for 'Present' */}
            <span className={`w-8 h-8 rounded-full ${p.value ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">
              {p.value ? "Present" : "Pending"}
            </span>
          </div>
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
    },
    {
      headerName: "Certificate",
      width: 150,
      cellRenderer: (p) => {
        const isPresent = p.data.isCMEAttended;
        const hasCert = p.data.cmeCertificateDetails?.length > 0;

        return (
          <button 
            disabled={!isPresent}
            onClick={() => {
              setActiveReg(p.data);
              // Load existing data if available, otherwise reset form
              setCertForm(hasCert ? p.data.cmeCertificateDetails[0] : {
                certificateNumber: "",
                certificateName: "",
                creditPoints: 0,
                issuedBy: "",
                issuedDate: new Date().toISOString(),
                validTill: new Date().toISOString(),
                certificateUrl: ""
              });
              setIsCertModalOpen(true);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
              !isPresent 
                ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed" 
                : hasCert 
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100" 
                  : "bg-white text-slate-900 border border-slate-200 hover:border-indigo-500 shadow-sm"
            }`}
          >
            {hasCert ? "Edit Cert" : "Assign Cert"}
          </button>
        );
      }
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
                        {registrations?.filter(r => r.isCMEAttended).length} / {registrations.length} Present
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
      {isCertModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl my-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Certificate Issuance</h3>
                <p className="text-xs text-slate-500 mt-1">Participant: {activeReg?.emailId}</p>
              </div>
              <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-600 text-[10px] font-black uppercase">
                CME Credit
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Certificate Name</label>
                <input 
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                  value={certForm.certificateName}
                  onChange={(e) => setCertForm({...certForm, certificateName: e.target.value})}
                  placeholder="e.g. Advanced Cardiology Workshop"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cert Number</label>
                <input 
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={certForm.certificateNumber}
                  onChange={(e) => setCertForm({...certForm, certificateNumber: e.target.value})}
                  placeholder="CME-2025-001"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Credit Points</label>
                <input 
                  type="number"
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={certForm.creditPoints}
                  onChange={(e) => setCertForm({...certForm, creditPoints: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Issued By</label>
                <input 
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  value={certForm.issuedBy}
                  onChange={(e) => setCertForm({...certForm, issuedBy: e.target.value})}
                  placeholder="Hospital/Council Name"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Valid Till</label>
                <input 
                  type="date"
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                  onChange={(e) => setCertForm({...certForm, validTill: new Date(e.target.value).toISOString()})}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setIsCertModalOpen(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveCertificate}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}

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