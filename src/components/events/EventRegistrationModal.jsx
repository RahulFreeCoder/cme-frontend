import React from "react";
import { X, ShieldCheck, Ticket, CreditCard } from "lucide-react";
import RegistrationFees from "./RegistrationFees";
import PaymentDetails from "./PaymentDetails";
import PaymentForm from "./PaymentForm";

const EventRegistrationModal = ({ event, user, onClose }) => {
  const isFree = !event.registrationFees?.length || event.registrationFees.every(f => f.price === 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-260 p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header: Compact & Integrated */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="flex-1 pr-8">
            <h2 className="text-lg font-black text-slate-900 leading-tight truncate">{event.title}</h2>
            <div className={`mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isFree ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-wider">{isFree ? 'Complimentary' : 'Secure Payment'}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Fees: Minimalist View */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <RegistrationFees fees={event.registrationFees} compact />
          </div>

          {!isFree ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-2"><PaymentDetails paymentDetails={event.paymentDetails} compact /></div>
              <PaymentForm eventId={event.cmeId} email={user?.email} onClose={onClose} />
            </div>
          ) : (
            /* Free State: Compact Ticket UX */
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 text-emerald-600 mb-3">
                <Ticket size={24} className="rotate-12" />
                <div className="h-8 w-px bg-emerald-200" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest">Access Granted</p>
                  <p className="text-xs font-bold text-emerald-800">No payment required</p>
                </div>
              </div>
              <PaymentForm eventId={event.cmeId} email={user?.email} isFree={true} onClose={onClose} />
            </div>
          )}
        </div>

        {/* Footer: Trust Indicators */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-center items-center gap-4">
          <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <ShieldCheck size={12} /> SSL Encrypted
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-widest">
            <CreditCard size={12} /> Instant Confirmation
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationModal;