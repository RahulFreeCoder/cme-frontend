import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useSelector } from "react-redux";
import axiosInstance from "../../services/axiosinstance";
import { dateFormatter, currencyFormatter } from "../utils/dataFormatter";
import { 
  CreditCard, 
  Receipt, 
  Calendar, 
  Award, 
  History, 
  FileText,
  Search,
  ChevronRight
} from "lucide-react";

// Register necessary AG Grid modules here if using Enterprise, 
// otherwise community works out of the box with standard import

import "ag-grid-community/styles/ag-theme-alpine.css";

export default function PaymentHistory({ email }) {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const events = useSelector((state) => state.events.events);

  useEffect(() => {
    if (!email) return;
    axiosInstance
      .get("/api/CMERegistration/GetCMERegistrationByUserByCME", { params: { emailId: email } })
      .then((res) => setRowData(res.data || []));
  }, [email]);

  const eventMap = useMemo(() => {
    return events.reduce((acc, e) => {
      acc[e.cmeId] = e;
      return acc;
    }, {});
  }, [events]);

  const enrichedRowData = useMemo(() => {
    return rowData.flatMap((r, index) => {
      const event = eventMap[r.cmeId] || {};
      if (!Array.isArray(r.paymentDetails) || r.paymentDetails.length === 0) {
        return [{
          cmeId: r.cmeId,
          eventTitle: event.title || "—",
          credits: event.credits ?? "—",
          eventDate: dateFormatter(event.startDate),
          paymentAmount: 0,
          paymentStatus: "NO PAYMENT",
          transactionId: "—",
          paymentMode: "—",
          paymentDate: "—",
          rowId: `${r.cmeId}-${index}-nopay`
        }];
      }
      return r.paymentDetails.map((p, pIndex) => ({
        cmeId: r.cmeId,
        eventTitle: event.title || "—",
        credits: event.credits ?? "—",
        eventDate: dateFormatter(event.startDate),
        paymentAmount: p.amount ?? 0,
        paymentStatus: p.status?.toUpperCase() ?? "—",
        transactionId: p.transactionId ?? "—",
        paymentMode: p.modeOfPayment ?? "—",
        paymentDate: dateFormatter(p.date),
        rowId: `${r.cmeId}-${index}-${pIndex}`
      }));
    });
  }, [rowData, eventMap]);

  const columnDefs = useMemo(() => [
    {
      headerName: "Event Information",
      children: [
        {
          headerName: "Event Title",
          field: "eventTitle",
          flex: 2,
          minWidth: 250,
          cellRenderer: (p) => (
            <div className="flex flex-col justify-center h-full py-2">
              <span className="text-sm font-bold text-slate-800 truncate">{p.value}</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">ID: {p.data.cmeId}</span>
            </div>
          )
        },
        {
          headerName: "Credits",
          field: "credits",
          width: 100,
          cellClass: "font-mono font-bold text-slate-600"
        }
      ]
    },
    {
      headerName: "Transaction Details",
      children: [
        {
          headerName: "Amount",
          field: "paymentAmount",
          width: 130,
          valueFormatter: (p) => currencyFormatter.format(p.value),
          cellClass: "font-bold text-slate-900"
        },
        {
          headerName: "Status",
          field: "paymentStatus",
          width: 130,
          cellRenderer: (p) => {
            const status = p.value;
            const colors = {
              SUCCESS: "bg-emerald-50 text-emerald-600 border-emerald-100",
              CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-100",
              FAILED: "bg-rose-50 text-rose-600 border-rose-100",
              REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
              PENDING: "bg-amber-50 text-amber-600 border-amber-100"
            };
            const style = colors[status] || "bg-slate-50 text-slate-500 border-slate-100";
            return (
              <div className="flex items-center h-full">
                <span className={`px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${style}`}>
                  {status}
                </span>
              </div>
            );
          }
        },
        {
          headerName: "Ref ID",
          field: "transactionId",
          width: 160,
          cellClass: "text-xs font-medium text-slate-400"
        }
      ]
    },
    {
      headerName: "Payment Date",
      field: "paymentDate",
      width: 140,
      sort: 'desc',
      cellClass: "text-xs font-semibold text-slate-600"
    }
  ], []);

  const totals = useMemo(() => {
    const uniqueCmeIds = new Set(enrichedRowData.map((r) => r.cmeId));
    const totalCredits = [...uniqueCmeIds].reduce((sum, id) => {
      const ev = eventMap[id] || {};
      return sum + (Number(ev.credits) || 0);
    }, 0);
    const totalAmount = enrichedRowData.reduce((sum, r) => sum + Number(r.paymentAmount || 0), 0);
    return { credits: totalCredits, amount: totalAmount, registeredCmes: uniqueCmeIds.size };
  }, [enrichedRowData, eventMap]);

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="text-slate-400" size={20} />
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Financial Ledger</h2>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registration & Payment Reconciliation</p>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter Records..." 
                  onChange={(e) => gridApi?.setQuickFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-4 focus:ring-indigo-50 outline-none w-64 transition-all"
                />
             </div>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard label="Registered CMEs" value={totals.registeredCmes} icon={FileText} color="text-slate-600" />
          <MetricCard label="Accumulated Credits" value={totals.credits} icon={Award} color="text-indigo-600" />
          <MetricCard label="Total Investment" value={currencyFormatter.format(totals.amount)} icon={CreditCard} color="text-emerald-600" />
        </div>

        {/* GRID CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Receipt size={16} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction History</span>
             </div>
          </div>
          
          <div className="ag-theme-alpine custom-grid" style={{ height: 500, width: "100%" }}>
            <AgGridReact
              rowData={enrichedRowData}
              columnDefs={columnDefs}
              onGridReady={(params) => setGridApi(params.api)}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                headerClass: "text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50"
              }}
              rowHeight={60}
              headerHeight={48}
              animateRows={true}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-grid .ag-root-wrapper { border: none !important; border-radius: 0 !important; }
        .custom-grid .ag-header { border-bottom: 1px solid #f1f5f9 !important; }
        .custom-grid .ag-row { border-bottom: 1px solid #f8fafc !important; }
        .custom-grid .ag-cell { display: flex; align-items: center; border: none !important; }
        .custom-grid .ag-header-cell-label { justify-content: start !important; }
        .ag-theme-alpine {
            --ag-font-family: 'Inter', sans-serif;
            --ag-font-size: 13px;
            --ag-header-background-color: #fbfcfd;
            --ag-odd-row-background-color: #ffffff;
            --ag-row-hover-color: #f8fafc;
            --ag-selected-row-background-color: #eff6ff;
        }
      `}</style>
    </div>
  );
}

/* --- HELPER SUB-COMPONENTS --- */
const MetricCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 group hover:border-indigo-100 transition-all">
    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
      <Icon className={color} size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);