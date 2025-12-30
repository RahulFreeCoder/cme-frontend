import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitCMERegistration } from "../../redux/events/cmeRegistrationSlice";
import { CheckCircle2, ArrowRight, Info, ShieldCheck, Ticket } from "lucide-react";

const PaymentForm = ({ eventId, email, onClose, isFree }) => {
  const dispatch = useDispatch();
  const { submitting, successMessage, errorMessage } = useSelector(
    (state) => state.cmeRegistration
  );

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // Initialize state based on whether it is a free or paid event
  const [form, setForm] = useState({
    amount: isFree ? "0" : "",
    paymentDate: getTodayDate(),
    transactionId: isFree ? `FREE-${Date.now()}` : "",
    paymentMode: isFree ? "Complimentary" : "",
    message: isFree ? "Complimentary Registration" : "",
    status: isFree ? "Confirmed" : "Pending"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    const payload = {
      cmeId: eventId,
      emailId: email,
      paymentDetails: [{
        amount: Number(form.amount),
        date: new Date(form.paymentDate).toISOString(),
        status: form.status,
        modeOfPayment: form.paymentMode || 'Other',
        transactionId: form.transactionId,
        message: form.message,
      }],
    };

    dispatch(submitCMERegistration(payload));
  };

  // 1. SUCCESS STATE VIEW
  if (successMessage) {
    return (
      <div className="text-center py-4 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 mb-1">Registration Successful</h3>
        <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
          Your details have been recorded. <br /> Check your email for the confirmation.
        </p>
        <button 
          onClick={onClose} 
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg"
        >
          Close Window
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Error Message */}
      {errorMessage && (
        <div className="flex gap-2 items-center text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl animate-in fade-in">
          <Info size={14} className="shrink-0" /> {errorMessage}
        </div>
      )}

      {!isFree ? (
        /* 2. PAID FORM VIEW (Compact) */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount Paid</label>
              <input
                name="amount"
                type="number"
                placeholder="INR"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference / Transaction ID</label>
            <input
              name="transactionId"
              placeholder="Ex: UPI-82937..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
            <select
              name="paymentMode"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
              onChange={handleChange}
            >
              <option value="">Select Option</option>
              <option value="UPI">UPI (GPay / PhonePe)</option>
              <option value="Bank Transfer">NEFT / Bank Transfer</option>
              <option value="Cash">Cash / On-Site</option>
            </select>
          </div>
        </div>
      ) : (
        /* 3. FREE STATE SUMMARY */
        <div className="py-2">
          <div className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <Ticket className="text-emerald-600 shrink-0" size={24} />
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Complimentary Access</p>
              <p className="text-[9px] font-bold text-emerald-600/70 uppercase">No Manual Verification Needed</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBMIT BUTTON */}
      <button
        disabled={submitting}
        onClick={handleSubmit}
        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 shadow-xl
          ${submitting 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
            : isFree 
              ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5" 
              : "bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-0.5"
          }
        `}
      >
        {submitting ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : isFree ? (
          <>Confirm Attendance <ArrowRight size={14} /></>
        ) : (
          <>Confirm Payment <ArrowRight size={14} /></>
        )}
      </button>

      {/* Trust Footer */}
      <div className="flex justify-center items-center gap-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
        <ShieldCheck size={12} className="text-slate-300" /> Secure Medical Portal
      </div>
    </div>
  );
};

export default PaymentForm;