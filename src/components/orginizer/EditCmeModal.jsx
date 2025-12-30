import AddCme from "./AddCme";
import { X } from "lucide-react";

export default function EditCmeModal({ cme, onClose }) {
  return (
    <div className="fixed inset-0 z-160 bg-black/40 flex items-center justify-center">
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl h-[99vh] rounded-xl shadow-lg flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Update CME</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AddCme
            mode="edit"
            initialData={cme}
          />
            <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>
                

      </div>
    </div>
  );
}
