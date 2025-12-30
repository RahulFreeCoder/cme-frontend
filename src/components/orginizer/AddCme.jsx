import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";

// External Components
import ChipsSelector from "./ChipSelector";
import TimePicker from "./TimePicker";

// Icons
import { 
  ChevronRight, ChevronLeft, Save, Plus, Trash2, 
  Info, Calendar, Users, IndianRupee, MapPin, Phone, 
  CreditCard, ListChecks, Mic2, Briefcase, CheckCircle2,
  Clock, Landmark, Globe, X, Award
} from "lucide-react";

/* ---------- Constants ---------- */
const STEPS = [
  "Basic Info", "Date & Location", "Capacity & Credits", "Fees", 
  "Schedule", "Organizer & Contact", "Payment", 
  "Additional Info", "Review"
];

const SPECIALITIES = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine", "Radiology"];
const CME_CATEGORIES = ["Conference", "Workshop", "Seminar", "Webinar"];
const FEE_CATEGORIES = ["Doctor", "Student", "Early Bird", "Regular"];

/* ---------- UI Sub-Components ---------- */
const CleanInput = ({ label, type = "text", value = "", onChange, disabled = false, error, textarea = false }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-4 bg-slate-50 border rounded-xl text-sm font-medium transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none min-h-[120px] ${
          error ? "border-red-400 bg-red-50/50" : "border-slate-200"
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none ${
          error ? "border-red-400 bg-red-50/50" : "border-slate-200"
        } ${disabled ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
      />
    )}
    {error && <p className="text-red-500 text-[10px] ml-1 font-bold italic tracking-tight">{error}</p>}
  </div>
);

const SectionHeader = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-4 mb-10 pb-6 border-b border-slate-50">
    <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-indigo-600">
      <Icon size={22} />
    </div>
    <div>
      <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{desc}</p>
    </div>
  </div>
);

const ReviewCard = ({ label, value, icon: Icon, full = false }) => (
  <div className={`p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 ${full ? 'col-span-full' : ''}`}>
    {Icon && <Icon size={14} className="text-slate-400 mt-1" />}
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800 leading-snug">{value || "—"}</p>
    </div>
  </div>
);

/* ---------- Main Component ---------- */
export default function AddCme({ mode = "add", initialData = null }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const userEmail = useSelector((state) => state.auth.user.email);
  console.log('Errors', errors);  

  const [formData, setFormData] = useState({
    title: "", cmeId: "", description: "", speciality: [], cmeCategories: [],
    startDate: "", endDate: "", startTime: "", endTime: "",
    location: { address: "", city: "", state: "", country: "", zipCode: "" },
    registrationFees: [], credits: 0, totalSeats: 0, isActive: true,
    schedule: [
      { date: "", time: "", topics: "", speaker: [] 
    }
    ], 
    organizer: { organization: "", email: userEmail, phone: "", website: "", committee: "" },
    contact: { name: "", phoneNumber: "", email: "" },
    paymentDetails: { accountNumber: "", accountName: "", ifscCode: "", upiCode: "", date: new Date().toISOString() },
    additionalInformation: [],
  });

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const required = (v) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
  const pathToField = (path) => path.replace(/^\$\./, "").replace(/\[(\d+)\]/g, ".$1");

  /* ---------- Validation Logic ---------- */
  const runValidation = (stepIdx = step) => {
    const errs = {};
    console.log('errs: ', errs);
    switch (stepIdx) {
      case 0:
        if (!required(formData.title)) errs.title = "Title is required";
        if (!required(formData.description)) errs.description = "Description is required";
        if (formData.speciality.length === 0) errs.speciality = "Select at least one speciality";
        if (formData.cmeCategories.length === 0) errs.cmeCategories = "Select at least one category";
        break;
      case 1:
        if (!required(formData.startDate)) errs.startDate = "Start date required";
        if (!required(formData.endDate)) errs.endDate = "End date required";
        Object.entries(formData.location).forEach(([k, v]) => { if (!required(v)) errs[`location.${k}`] = `${k} required`; });
        break;
      case 2:
        if (formData.totalSeats <= 0) errs.totalSeats = "Seats must be > 0";
        if (formData.credits < 0) errs.credits = "Credits must be >= 0";
        break;
     case 3:
      // Removed: if (formData.registrationFees.length === 0) errs.registrationFees = "At least one fee required";
      
      // Only validate if fees are present
      if (formData.registrationFees && formData.registrationFees.length > 0) {
        formData.registrationFees.forEach((f, i) => {
          // Validate category only if price is entered, or vice versa
          if (!required(f.category)) {
            errs[`fee.${i}.category`] = "Category required";
          }
          if (f.price < 0) {
            errs[`fee.${i}.price`] = "Price cannot be negative";
          }
        });
      }
      break;
      case 4:
        if (formData.schedule.length === 0) errs.schedule = "Add at least one entry";
        formData.schedule.forEach((s, i) => {
          if (!required(s.date)) errs[`schedule.${i}.date`] = "Date required";
          if (!required(s.time)) errs[`schedule.${i}.time`] = "Time required";
          if (!required(s.topics)) errs[`schedule.${i}.topics`] = "Topic required";
          
          // Validate speakers within the schedule
          if (s.speaker && s.speaker.length > 0) {
            s.speaker.forEach((sp, si) => {
              if (!required(sp.name)) errs[`schedule.${i}.speaker.${si}.name`] = "Speaker name required";
            });
          }
        });
        break;
      case 5:
        // Validate only specific required fields in organizer
        if (!required(formData.organizer.organization)) errs["organizer.organization"] = "Organization name is required";
        if (!required(formData.organizer.phone)) errs["organizer.phone"] = "Phone number is required";

        // Validate all contact fields (Name, Phone, Email)
        Object.entries(formData.contact).forEach(([k, v]) => { 
          if (!required(v)) errs[`contact.${k}`] = "Required"; 
        });
        break;
      case 6:
        // Check if any fee category has a price greater than 0
        const isPaidEvent = formData.registrationFees.some(fee => fee.price > 0);

        if (isPaidEvent) {
          // If it's a paid event, all bank details are mandatory
          Object.entries(formData.paymentDetails).forEach(([k, v]) => {
            if (!required(v)) {
              errs[`payment.${k}`] = "Required for paid events";
            }
          });
        }
        // If isPaidEvent is false (Free CME), the loop is skipped and no errors are added
        break;
      case 7:
        //if (formData.additionalInformation.length === 0) errs.additionalInformation = "Required";
        break;
      default: break;
    }
    return errs;
  };

  const next = () => {
    const errMap = runValidation(step);
    if (Object.keys(errMap).length) {
      setErrors(errMap);
      toast.error("Please fix errors before proceeding");
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const submit = async () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const err = runValidation(i);
      if (Object.keys(err).length) {
        setErrors(err);
        setStep(i);
        toast.error("Validation failed at " + STEPS[i]);
        return;
      }
    }
    try {
      const apiMethod = mode === "edit" ? "put" : "post";
      console.log("cmeid", formData.cmeId);
      const apiUrl = mode === "edit" ? `/api/CME/admin/cme/${formData.cmeId}/update` : "/api/CME/admin/cme/add";
      const payload = { ...formData };

      // UX/Technical Logic: Remove cmeId for 'add' mode to let backend generate it
      if (mode === "add") {
        delete payload.cmeId;
      }

      await axiosInstance[apiMethod](apiUrl, payload);
      toast.success(mode === "edit" ? "CME updated" : "CME created");
      navigate("/organizer");
    } catch (err) {
      const apiData = err.response?.data;
      toast.error(apiData?.message || "Sync failed");
      const formatted = {};
      Object.entries(apiData?.errors || {}).forEach(([path, msgs]) => { formatted[pathToField(path)] = msgs[0]; });
      setErrors(formatted);
    }
  };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      console.log("Initial data for Edit", initialData);
      setFormData({ ...initialData, cmeId: initialData.cmeId || initialData.cmeid || "", startDate: initialData.startDate?.split("T")[0] ?? "", endDate: initialData.endDate?.split("T")[0] ?? "" });
    }
  }, [mode, initialData]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-0 min-h-screen bg-[#fafafa]">
      
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <div className="md:w-70 bg-white border-r border-slate-200 p-8 hidden md:block overflow-y-auto">
        <h1 className="text-xl font-black text-slate-900 mb-10 tracking-tight">
          {mode === "edit" ? "Revise Event" : "Create Event"}
        </h1>
        <div className="space-y-1">
          {STEPS.map((s, i) => (
            <div 
              key={s} 
              className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-default ${
                step === i ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : 
                step > i ? "text-indigo-600 font-bold" : "text-slate-400"
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                step === i ? "border-white/20 bg-white/10" : step > i ? "bg-indigo-50 border-indigo-100" : "border-slate-100 bg-slate-50"
              }`}>
                {step > i ? "✓" : i + 1}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN FORM AREA */}
      <div className="flex-1 flex flex-col bg-transparent">
        {/* STEP CONTENT */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 min-h-[600px] flex flex-col">
            
            <div className="flex-1 overflow-visible">
              {step === 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={Info} title="Basic Information" desc="Configure identity and specialities" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {mode === "edit" ? (
                      <>
                        <CleanInput 
                          label="CME ID" 
                          value={formData.cmeId} 
                          onChange={(v) => update("cmeId", v)} 
                          disabled={true} 
                          error={errors.cmeId} 
                        />
                        <div className="md:col-span-2">
                          <CleanInput 
                            label="Event Title" 
                            value={formData.title} 
                            onChange={(v) => update("title", v)} 
                            error={errors.title} 
                          />
                        </div>
                      </>
                    ) : (
                      /* Full width title for Add mode */
                      <div className="md:col-span-3">
                        <CleanInput 
                          label="Event Title" 
                          value={formData.title} 
                          onChange={(v) => update("title", v)} 
                          error={errors.title} 
                        />
                      </div>
                    )}
                  </div>
                  <CleanInput label="Public Description" textarea value={formData.description} onChange={(v) => update("description", v)} error={errors.description} />
                  <div className="mt-8 space-y-8">
                    <ChipsSelector options={SPECIALITIES} value={formData.speciality} onChange={(v) => update("speciality", v)} label="Medical Specialities" />
                    <ChipsSelector options={CME_CATEGORIES} value={formData.cmeCategories} onChange={(v) => update("cmeCategories", v)} label="CME Classification" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={Calendar} title="Schedule & Venue" desc="Define logistics and location" />
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <CleanInput type="date" label="Starting Date" value={formData.startDate} onChange={(v) => update("startDate", v)} error={errors.startDate} />
                    <CleanInput type="date" label="Ending Date" value={formData.endDate} onChange={(v) => update("endDate", v)} error={errors.endDate} />
                    <TimePicker label="Check-in Opens" value={formData.startTime} onChange={(v) => update("startTime", v)} error={errors.startTime} />
                    <TimePicker label="Event Close" value={formData.endTime} onChange={(v) => update("endTime", v)} error={errors.endTime} />
                  </div>
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                       <MapPin size={16} /> <span className="text-[10px] font-black uppercase">Venue Details</span>
                    </div>
                    <CleanInput label="Venue Address" value={formData.location.address} onChange={(v) => update("location", { ...formData.location, address: v })} error={errors["location.address"]} />
                    <div className="grid grid-cols-2 gap-6">
                      <CleanInput label="City" value={formData.location.city} onChange={(v) => update("location", { ...formData.location, city: v })} error={errors["location.city"]} />
                      <CleanInput label="State" value={formData.location.state} onChange={(v) => update("location", { ...formData.location, state: v })} error={errors["location.state"]} />
                      <CleanInput label="Country" value={formData.location.country} onChange={(v) => update("location", { ...formData.location, country: v })} error={errors["location.country"]} />
                      <CleanInput label="Zip Code" value={formData.location.zipCode} onChange={(v) => update("location", { ...formData.location, zipCode: v })} error={errors["location.zipCode"]} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={Users} title="Capacity & Credits" desc="Attendee limits and certification" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl">
                    <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <CleanInput type="number" label="Intake Capacity" value={formData.totalSeats} onChange={(v) => update("totalSeats", Number(v))} error={errors.totalSeats} />
                      <p className="text-[10px] text-slate-400 font-bold mt-2">Maximum seats available for registration.</p>
                    </div>
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <CleanInput type="number" label="CME Credit Points" value={formData.credits} onChange={(v) => update("credits", Number(v))} error={errors.credits} />
                      <p className="text-[10px] text-indigo-400 font-bold mt-2 uppercase tracking-tighter">Points awarded to each attendee.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={IndianRupee} title="Pricing Tiers" desc="Configure registration fee structures" />
                  <div className="space-y-6">
                    {formData.registrationFees.map((fee, i) => (
                      <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group">
                        <button onClick={() => update("registrationFees", formData.registrationFees.filter((_, ix) => ix !== i))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16}/>
                        </button>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Category</label>
                            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-50"
                              value={fee.category} onChange={(e) => { const arr = [...formData.registrationFees]; arr[i].category = e.target.value; update("registrationFees", arr); }}>
                              <option value="">Choose...</option>
                              {FEE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors[`fee.${i}.category`] && <p className="text-red-500 text-[10px] font-bold">{errors[`fee.${i}.category`]}</p>}
                          </div>
                          <CleanInput label="Base Price (INR)" type="number" value={fee.price} onChange={(v) => { const arr = [...formData.registrationFees]; arr[i].price = Number(v); update("registrationFees", arr); }} error={errors[`fee.${i}.price`]} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <CleanInput label="Rule/Note" value={fee.rule} onChange={(v) => { const arr = [...formData.registrationFees]; arr[i].rule = v; update("registrationFees", arr); }} />
                          <CleanInput label="Early Bird %" type="number" value={fee.discountPercent} onChange={(v) => { const arr = [...formData.registrationFees]; arr[i].discountPercent = Number(v); update("registrationFees", arr); }} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => update("registrationFees", [...formData.registrationFees, { category: "", price: 0, rule: "", discountPercent: 0 }])}
                      className="w-full py-4 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
                      <Plus size={16}/> Add Fee Category
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={ListChecks} title="Scientific Schedule" desc="Timeline and Faculty Assignment" />
                  <div className="space-y-6">
                    {formData.schedule.map((s, i) => (
                      <div key={i} className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] relative">
                        <button 
                          onClick={() => update("schedule", formData.schedule.filter((_, ix) => ix !== i))} 
                          className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18}/>
                        </button>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <CleanInput type="date" label="Session Date" value={s.date} onChange={(v) => { const arr = [...formData.schedule]; arr[i].date = v; update("schedule", arr); }} error={errors[`schedule.${i}.date`]} />
                          <TimePicker label="Time Slot" value={s.time} onChange={(v) => { const arr = [...formData.schedule]; arr[i].time = v; update("schedule", arr); }} error={errors[`schedule.${i}.time`]} />
                        </div>
                        
                        <CleanInput label="Session Topic" textarea value={s.topics} onChange={(v) => { const arr = [...formData.schedule]; arr[i].topics = v; update("schedule", arr); }} error={errors[`schedule.${i}.topics`]} />

                        {/* NESTED SPEAKERS FOR THIS SESSION */}
                        <div className="mt-8 pt-6 border-t border-slate-200/60">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Assigned Faculty</h4>
                            <button 
                              type="button"
                              onClick={() => {
                                const arr = [...formData.schedule];
                                arr[i].speaker = [...(arr[i].speaker || []), { name: "", speciality: "", designation: "", isKeySpeaker: false }];
                                update("schedule", arr);
                              }}
                              className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase flex items-center gap-1 transition-colors"
                            >
                              <Plus size={12} /> Add Speaker
                            </button>
                          </div>

                          <div className="space-y-4">
                            {s.speaker?.map((sp, si) => (
                              <div key={si} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm relative group animate-in fade-in slide-in-from-left-2">
                                {/* Speaker Header & Remove Button */}
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speaker #{si + 1}</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const arr = [...formData.schedule];
                                      arr[i].speaker = arr[i].speaker.filter((_, six) => six !== si);
                                      update("schedule", arr);
                                    }}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>

                                {/* Row 1: Name and Speciality */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <CleanInput label="Speaker Name" value={sp.name} onChange={(v) => {
                                    const arr = [...formData.schedule];
                                    arr[i].speaker[si].name = v;
                                    update("schedule", arr);
                                  }} />
                                  <CleanInput label="Speciality" value={sp.speciality} onChange={(v) => {
                                    const arr = [...formData.schedule];
                                    arr[i].speaker[si].speciality = v;
                                    update("schedule", arr);
                                  }} />
                                </div>

                                {/* Row 2: Designation */}
                                <div className="mb-4">
                                  <CleanInput label="Designation" value={sp.designation} onChange={(v) => {
                                    const arr = [...formData.schedule];
                                    arr[i].speaker[si].designation = v;
                                    update("schedule", arr);
                                  }} />
                                </div>

                                {/* Row 3: Biography/Details */}
                                <div className="mb-4">
                                  <CleanInput label="Speaker Biography" textarea value={sp.details} onChange={(v) => {
                                    const arr = [...formData.schedule];
                                    arr[i].speaker[si].details = v;
                                    update("schedule", arr);
                                  }} />
                                </div>

                                {/* Row 4: Key Speaker Toggle */}
                                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                                    checked={sp.isKeySpeaker} 
                                    onChange={(e) => {
                                      const arr = [...formData.schedule];
                                      arr[i].speaker[si].isKeySpeaker = e.target.checked;
                                      update("schedule", arr);
                                    }} 
                                  />
                                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Mark as Key Speaker</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => update("schedule", [...formData.schedule, { date: "", time: "", topics: "", speaker: [] }])} className="w-full py-4 border border-dashed border-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 flex items-center justify-center gap-2">
                      <Plus size={16}/> Add New Session
                    </button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={Briefcase} title="Host Organization" desc="Corporate and organizer details" />
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <CleanInput label="Registered Organization" value={formData.organizer.organization} onChange={(v) => update("organizer", { ...formData.organizer, organization: v })} error={errors["organizer.organization"]} />
                      </div>
                      <CleanInput label="Official Phone" value={formData.organizer.phone} onChange={(v) => update("organizer", { ...formData.organizer, phone: v })} error={errors["organizer.phone"]} />
                      <CleanInput label="Website URL" value={formData.organizer.website} onChange={(v) => update("organizer", { ...formData.organizer, website: v })} error={errors["organizer.website"]} />
                    </div>
                    <CleanInput label="Committee Information" textarea value={formData.organizer.committee} onChange={(v) => update("organizer", { ...formData.organizer, committee: v })} error={errors["organizer.committee"]} />
                    
                    <div className="mt-10 pt-10 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-8 text-indigo-600">
                        <Phone size={18} /> <h3 className="text-sm font-bold uppercase tracking-widest">Primary Point of Contact</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                           <CleanInput label="Contact Person Name" value={formData.contact.name} onChange={(v) => update("contact", { ...formData.contact, name: v })} error={errors["contact.name"]} />
                        </div>
                        <CleanInput label="Contact Phone" value={formData.contact.phoneNumber} onChange={(v) => update("contact", { ...formData.contact, phoneNumber: v })} error={errors["contact.phoneNumber"]} />
                        <CleanInput label="Official Contact Email" value={formData.contact.email} onChange={(v) => update("contact", { ...formData.contact, email: v })} error={errors["contact.email"]} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Logic check: Is there at least one paid category? */}
                  {formData.registrationFees.some(fee => fee.price > 0) ? (
                    <>
                      <SectionHeader 
                        icon={CreditCard} 
                        title="Bank Details" 
                        desc="Payout and settlement information" 
                      />
                      <div className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-8">
                        <CleanInput 
                          label="Account Holder Name" 
                          value={formData.paymentDetails.accountName} 
                          onChange={(v) => update("paymentDetails", { ...formData.paymentDetails, accountName: v })} 
                          error={errors["payment.accountName"]} 
                        />
                        <CleanInput 
                          label="Bank Account Number" 
                          value={formData.paymentDetails.accountNumber} 
                          onChange={(v) => update("paymentDetails", { ...formData.paymentDetails, accountNumber: v })} 
                          error={errors["payment.accountNumber"]} 
                        />
                        <div className="grid grid-cols-2 gap-6">
                          <CleanInput 
                            label="IFSC Code" 
                            value={formData.paymentDetails.ifscCode} 
                            onChange={(v) => update("paymentDetails", { ...formData.paymentDetails, ifscCode: v })} 
                            error={errors["payment.ifscCode"]} 
                          />
                          <CleanInput 
                            label="UPI ID / VPA" 
                            value={formData.paymentDetails.upiCode} 
                            onChange={(v) => update("paymentDetails", { ...formData.paymentDetails, upiCode: v })} 
                            error={errors["payment.upiCode"]} 
                          />
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
                          <Landmark size={16} className="text-amber-600" />
                          <p className="text-[10px] font-bold text-amber-600 uppercase">
                            Settlements will be processed to this account based on the registration cycle.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* FREE EVENT UI: Shown when all fees are 0 or no fees are added */
                    <div className="flex flex-col items-center justify-center p-20 bg-emerald-50/50 border border-dashed border-emerald-200 rounded-[2.5rem] text-center">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-black text-emerald-900 tracking-tight mb-2">Free Event Detected</h3>
                      <p className="text-sm text-emerald-600 font-medium max-w-xs leading-relaxed">
                        Bank details are not required because this event is free for all attendees. You can proceed to the next step.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 7 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader icon={ListChecks} title="Additional Notes" desc="Misc instructions or registration details" />
                  <CleanInput label="Information Snippets (Comma-separated)" textarea 
                    placeholder="Lunch provided, Free parking, Carry ID card..."
                    value={formData.additionalInformation.join(", ")}
                    onChange={(v) => {
                        // Split by comma, but DON'T trim the individual strings yet
                        const tags = v.split(","); 
                        update("additionalInformation", tags);
                      }}
                    error={errors.additionalInformation}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                     {formData.additionalInformation.map((tag, i) => tag && (
                       <span key={i} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black rounded-full uppercase">{tag}</span>
                     ))}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-10">
                  <SectionHeader icon={CheckCircle2} title="Final Validation" desc="Review all data before publishing" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Logistics</h4>
                       <ReviewCard label="Title" value={formData.title} icon={Info} full />
                       <ReviewCard label="CME ID" value={formData.cmeId} />
                       <ReviewCard label="Dates" value={`${formData.startDate} to ${formData.endDate}`} icon={Calendar} />
                       <ReviewCard label="Time" value={`${formData.startTime} - ${formData.endTime}`} icon={Clock} />
                       <ReviewCard label="Venue" value={formData.location.address} icon={MapPin} full />
                    </div>
                    
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Metrics</h4>
                       <ReviewCard label="Total Seats" value={formData.totalSeats} icon={Users} />
                       <ReviewCard label="CME Credits" value={formData.credits} icon={Award} />
                       <ReviewCard label="Specialities" value={formData.speciality.join(", ")} full />
                       <ReviewCard label="Contact" value={formData.contact.name} icon={Phone} full />
                    </div>
                  </div>

                  <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                    <div className="flex items-center gap-2 mb-6 opacity-50">
                       <CreditCard size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Bank Payout Info</span>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Account Name</p>
                        <p className="text-sm font-bold">{formData.paymentDetails.accountName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Account Number</p>
                        <p className="text-sm font-bold font-mono">{formData.paymentDetails.accountNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NAVIGATION FOOTER */}
            <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center">
              <button type="button" onClick={back} disabled={step === 0} 
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  step === 0 ? "text-slate-300" : "text-slate-500 hover:bg-slate-50"
                }`}>
                <ChevronLeft size={16}/> Back
              </button>
              
              <div className="flex gap-4">
                <button type="button" onClick={step < STEPS.length - 1 ? next : submit} 
                  className={`flex items-center gap-3 px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all ${
                    step < STEPS.length - 1 ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  }`}>
                  {step < STEPS.length - 1 ? "Next Step" : "Publish Event"} 
                  {step < STEPS.length - 1 ? <ChevronRight size={16}/> : <Save size={16}/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}