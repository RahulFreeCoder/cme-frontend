import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axiosInstance from "../../services/axiosinstance";
import notify from '../ui/notify';
import { Search, CheckCircle, XCircle, RotateCcw, Wallet , ChevronDown} from "lucide-react";

// Core Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Payments() {
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
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* ------------------------------------------------------------------- */
  /* 2️⃣ Fetching & Flattening (Triggered by selectedCmeId)              */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedCmeId) {
      setRowData([]);
      return;
    }

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/CMERegistration/GetCMERegistrationByUserByCME", {
          params: { cmeId: selectedCmeId },
        });

        // Mapping your nested schema to flat grid rows
        const flattened = (response.data.data || []).map(reg => ({
          ...reg,
          amount: reg.paymentDetails?.[0]?.amount || 0,
          paymentStatus: reg.paymentDetails?.[0]?.status || "Pending",
          transactionId: reg.paymentDetails?.[0]?.transactionId || "N/A",
          modeOfPayment: reg.paymentDetails?.[0]?.modeOfPayment || "N/A"
        }));

        setRowData(flattened);
      } catch (err) {
        setRowData([]);
        const errorData = err.response?.data;
    
        if (err.response?.status === 404) {
          // Instead of an error toast, we show an informative info toast
          notify.error(
            errorData?.message || "No Payments for this event", 
            errorData?.detail || "Verify CMEId, EmailId, and TransactionId."
          );
        } else {
          // For actual system errors (500, network failure, etc.)
           notify.error(
            errorData?.message || "Sever Error,", 
            errorData?.detail || "Please retry or contact system adminstrator"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [selectedCmeId]);

  /* ------------------------------------------------------------------- */
  /* 3️⃣ Update Status Logic (Compliant with PaymentDetails Array)       */
  /* ------------------------------------------------------------------- */
  const updatePaymentStatus = useCallback(async (row, newStatus) => {
  // 1. Create the updated record for local UI (optimistic update)
  const updatedRecord = {
    ...row,
    paymentDetails: row.paymentDetails.map((p, index) => 
      index === 0 ? { ...p, status: newStatus } : p
    )
  };

  setRowData((prev) => 
    prev.map((r) => (r.id === row.id ? { ...updatedRecord, paymentStatus: newStatus } : r))
  );

  try {
    // 2. Extract specific fields. Access transactionId from the first payment object.
    const payload = {
      cmeId: row.cmeId,
      emailId: row.emailId,
      transactionId: (row.paymentDetails?.[0]?.transactionId) || "0", // Map from nested array
      status: newStatus // The new status being assigned
    };

    // 3. Send the specific payload to the backend
    await axiosInstance.put("/api/CMERegistration/UpdateCMERegistration", payload);
    
    notify.success("Payment Updated", `Status: ${newStatus}`);
  } catch (error) {
    // Rollback local state on failure
    setRowData((prev) => prev.map((r) => (r.id === row.id ? row : r)));

    // 1. Extract error details from the 500 response
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || "Update failed";
    const errorDetail = errorData?.detail || "Please check your connection";

    // 2. Show detailed Toast
    notify.error(
    errorData?.message || "Sync Failed", 
    errorData?.detail || "Verify CMEId, EmailId, and TransactionId."
  );
  }
}, []);

  /* ------------------------------------------------------------------- */
  /* 4️⃣ Grid Columns                                                    */
  /* ------------------------------------------------------------------- */
  const columnDefs = useMemo(() => [
    { field: "transactionId", headerName: "TXN ID", width: 140 },
    { field: "emailId", headerName: "Participant", flex: 1, minWidth: 200 },
    { 
      field: "amount", 
      headerName: "Amount", 
      width: 100,
      valueFormatter: (p) => p.value ? `₹${p.value}` : "-" 
    },
    { field: "modeOfPayment", headerName: "Mode", width: 90 },
    {
      headerName: "Status",
      field: "paymentStatus",
      width: 130,
      cellRenderer: (p) => {
        const styles = {
          Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
          Rejected: "bg-rose-100 text-rose-700 border-rose-200",
          Reversal: "bg-amber-100 text-amber-700 border-amber-200",
          Pending: "bg-blue-50 text-blue-600 border-blue-200"
        };
        return (
          <div className="flex items-center h-full">
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black border ${styles[p.value] || "bg-slate-50 text-slate-400"}`}>
              {p.value}
            </span>
          </div>
        );
      }
    },
    {
      headerName: "Verify",
      width: 180,
      cellRenderer: (p) => (
        <div className="flex gap-2 items-center h-full">
          <button 
            onClick={() => updatePaymentStatus(p.data, "Confirmed")}
            className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
          >
            <CheckCircle size={14} />
          </button>
          <button 
            onClick={() => updatePaymentStatus(p.data, "Rejected")}
            className="p-1.5 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
          >
            <XCircle size={14} />
          </button>
          <button 
            onClick={() => updatePaymentStatus(p.data, "Reversal")}
            className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )
    }
  ], [updatePaymentStatus]);

  return (
    <div className="p-4 md:p-10 bg-[#fcfdfe] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
                {/* 1. SELECTOR CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Payments Management</h2>
            
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
          <>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search Payments..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue (Confirmed)</p>
                  <p className="text-lg font-black text-emerald-600">
                    ₹{rowData?.filter(r => r.paymentStatus === 'Confirmed').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-4">
              <div className="ag-theme-alpine w-full h-[500px] custom-payment-grid">
                <AgGridReact
                  ref={gridRef}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  quickFilterText={searchText}
                  defaultColDef={{ sortable: true, resizable: true }}
                  rowHeight={55}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-payment-grid .ag-root-wrapper { border: none !important; }
        .custom-payment-grid .ag-header { background-color: white !important; border-bottom: 2px solid #f8fafc !important; }
        .custom-payment-grid .ag-header-cell-label { color: #94a3b8 !important; font-size: 11px !important; text-transform: uppercase !important; font-weight: 800 !important; }
        .custom-payment-grid .ag-row { border-bottom: 1px solid #f1f5f9 !important; }
        .custom-payment-grid .ag-cell { display: flex; align-items: center; border: none !important; }
      `}</style>
    </div>
  );
}