import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";
import { Search, CheckCircle, XCircle, RotateCcw, Wallet } from "lucide-react";

// Core Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Payments() {
  const gridRef = useRef();
  
  // 1️⃣ RESTORED: Getting CME IDs from Redux Slice
  const allCmeIds= useSelector((s) => s.organizer.cmeIds);

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
        const flattened = (response.data || []).map(reg => ({
          ...reg,
          amount: reg.paymentDetails?.[0]?.amount || 0,
          paymentStatus: reg.paymentDetails?.[0]?.status || "Pending",
          transactionId: reg.paymentDetails?.[0]?.transactionId || "N/A",
          modeOfPayment: reg.paymentDetails?.[0]?.modeOfPayment || "N/A"
        }));

        setRowData(flattened);
      } catch (err) {
        toast.error("Failed to load records");
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
      transactionId: row.paymentDetails[0]?.transactionId, // Map from nested array
      status: newStatus // The new status being assigned
    };

    // 3. Send the specific payload to the backend
    await axiosInstance.patch("/api/CMERegistration/UpdateCMERegistration", payload);
    
    toast.success(`Payment status: ${newStatus}`);
  } catch (error) {
    // Rollback local state on failure
    setRowData((prev) => prev.map((r) => (r.id === row.id ? row : r)));
    toast.error("Update failed");
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
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* CME SELECTION CHIPS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center justify-center gap-2">
            <Wallet className="text-emerald-500" size={20} /> Select CME for Payment Verification
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {allCmeIds?.map((id) => (
              <button
                key={id}
                onClick={() => { setSelectedCmeId(id); setSearchText(""); }}
                className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  selectedCmeId === id 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-emerald-300"
                }`}
              >
                {id}
              </button>
            ))}
            {(!allCmeIds || allCmeIds.length === 0) && <p className="text-slate-400 italic">No CMEs available</p>}
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
                    ₹{rowData.filter(r => r.paymentStatus === 'Confirmed').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
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