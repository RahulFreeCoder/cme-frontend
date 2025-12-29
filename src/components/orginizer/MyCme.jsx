import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setListCmes } from "../../redux/organizer/OrganizerSlice";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Pencil, Trash2, Search } from "lucide-react"; // Added Search icon
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";
import EditCmeModal from "./EditCmeModal";

// Styles
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function MyCme() {
  const email = useSelector((s) => s.auth.user.email);
  const [reloadCmes, setReloadCmes] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [selectedCme, setSelectedCme] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteCme, setDeleteCme] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // 🔍 Search State
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();

  /* ---------- Fetch CMEs ---------- */
  useEffect(() => {
    axiosInstance
      .get("/api/CME/cme", { params: { organizerEmail: email } })
      .then((r) => {
        const cmes = r.data || [];
        setRowData(cmes);

        const now = new Date();
        const validCmeIds = cmes
          // .filter((cme) => {
          //   if (!cme.startDate) return false;
          //   const startDate = new Date(cme.startDate);
          //   const sevenDaysAfterStart = new Date(startDate);
          //   sevenDaysAfterStart.setDate(startDate.getDate() + 7);
          //   return now >= startDate && now <= sevenDaysAfterStart;
          // })
          .map((c) => c.cmeId);

        dispatch(setListCmes(validCmeIds));
      })
      .catch(() => toast.error("Failed to load CMEs"));
  }, [email, reloadCmes, dispatch]);

  const handleDelete = async () => {
    if (!deleteCme) return;
    try {
      setDeleting(true);
      await axiosInstance.delete(`/api/CME/admin/cme/${deleteCme.cmeId}/delete`);
      toast.success("CME deleted successfully");
      setRowData((prev) => prev.filter((c) => c.cmeId !== deleteCme.cmeId));
      setDeleteCme(null);
      setReloadCmes((v) => v + 1);
    } catch (err) {
      toast.error("Failed to delete CME");
    } finally {
      setDeleting(false);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Actions",
        width: 100,
        pinned: "left",
        filter: false,
        cellRenderer: (params) => (
          <div className="flex gap-3 items-center h-full">
            <button
              title="Edit CME"
              className="text-blue-600 hover:text-blue-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCme({ ...params.data, cmeid: params.data.cmeId });
                setEditOpen(true);
              }}
            >
              <Pencil size={18} />
            </button>

            <button
              title="Delete CME"
              className="text-red-600 hover:text-red-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteCme(params.data);
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
      { field: "title", headerName: "Title", flex: 2, minWidth: 200, cellStyle: { fontWeight: '500' } },
      {
        headerName: "Specialities",
        valueGetter: (p) => p.data.speciality?.join(", "),
        flex: 1,
      },
      {
        headerName: "Categories", // Restored
        valueGetter: (p) => p.data.cmeCategories?.join(", "),
        flex: 1,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        width: 130,
        valueFormatter: (p) => p.value?.slice(0, 10),
      },
      {
        field: "endDate", // Restored
        headerName: "End Date",
        width: 130,
        valueFormatter: (p) => p.value?.slice(0, 10),
      },
      { field: "credits", headerName: "Credits", width: 110 }, // Restored
      { field: "totalSeats", headerName: "Total Seats", width: 110 }, // Restored
      { field: "registeredSeats", headerName: "Reg.", width: 90 },
      {
        field: "isActive",
        headerName: "Status",
        width: 110,
        cellRenderer: (p) => (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {p.value ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* -------- Header & Search Toolbar -------- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
            placeholder="Search titles, IDs, or specialities..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* -------- Grid -------- */}
      <div className="ag-theme-alpine shadow-md rounded-xl overflow-hidden border border-gray-200" style={{ height: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={searchText} // 🔍 Linking search input
          pagination={true}
          paginationPageSize={15}
          rowHeight={55}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </div>

      {/* -------- Modals -------- */}
      {selectedCme && (
        <EditCmeModal
          cme={selectedCme}
          onClose={() => setSelectedCme(null)}
          onUpdated={() => {
            toast.success("CME updated");
            setSelectedCme(null);
            setReloadCmes((v) => v + 1);
          }}
        />
      )}

      {deleteCme && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete CME</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{deleteCme.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50" onClick={() => setDeleteCme(null)}>Cancel</button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-200" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}