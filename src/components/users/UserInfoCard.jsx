import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosinstance";
import toast from "react-hot-toast";
import { 
  Mail, Phone, MapPin, Award, Briefcase, Edit3, X, 
  ShieldCheck, Building2, Landmark, Loader2, Save,
  GraduationCap, Globe, Users, Calendar, UserCheck, Plus, Trash2
} from "lucide-react";

/* --- 1. REFINED UI SUB-COMPONENTS --- */
const CardSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl mb-6 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
      <Icon size={18} className="text-slate-500" />
      <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 py-2">
    {Icon && <Icon size={14} className="mt-1 text-slate-400" />}
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-700">{value || "—"}</p>
    </div>
  </div>
);

export default function UserInfoCard({ selectedUser }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => { fetchUserProfile(); }, [selectedUser?.email]);

  const fetchUserProfile = async () => {
    if (!selectedUser?.email) return;
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/User/GetUser", { params: { email: selectedUser.email } });
      setUser(response.data);
      setEditData(response.data);
    } catch (err) { toast.error("Sync failed"); } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.put(`/api/User/${editData.id}`, editData);
      toast.success("Professional records synchronized");
      setIsEditing(false);
      fetchUserProfile();
    } catch (err) { toast.error("Update failed"); } finally { setLoading(false); }
  };

  if (loading && !user) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={32}/></div>;

  return (
    <div className="max-w-7xl mx-auto bg-[#fafafa] min-h-screen font-sans antialiased pb-20">
      
      {/* 1. TOP NAV / HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <UserCheck size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">
                {user.prefix} {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{user.specialization}</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Edit3 size={14} /> Edit Credentials
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. LEFT CONTENT (The meat of the profile) */}
        <div className="lg:col-span-8">
          
          {/* STATS OVERVIEW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatBox label="CME Points" value={user.totalCreditPoints} />
            <StatBox label="Experience" value={`${user.experience} yrs`} />
            <StatBox label="Registrations" value={user.registeredEvents} />
            <StatBox label="Events Made" value={user.createdEvents} />
          </div>

          <CardSection title="Career Timeline" icon={Briefcase}>
            <div className="space-y-8">
              {user.professionalExperiences?.length > 0 ? user.professionalExperiences.map((exp, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 mt-1.5" />
                    <div className="w-[1px] h-full bg-slate-100 mt-1" />
                  </div>
                  <div className="pb-6">
                    <h4 className="text-sm font-bold text-slate-800">{exp.designation}</h4>
                    <p className="text-xs font-bold text-indigo-600 mb-2 uppercase">{exp.employer}</p>
                    <p className="text-[10px] font-bold text-slate-400 mb-2">{exp.startDate} — {exp.endDate || "Current"}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-400 italic">No career data provided.</p>}
            </div>
          </CardSection>

          <CardSection title="Education & Academic" icon={GraduationCap}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Primary Medical Education" value={user.education} />
              <InfoItem label="Higher Education" value={user.higherEducation} />
            </div>
          </CardSection>

          {user.organization && (
            <CardSection title="Executive Leadership" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.executiveMembers?.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                    <p className="text-sm font-bold text-slate-800">{m.fullName}</p>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase">{m.designation}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">{m.contactNumber}</p>
                  </div>
                ))}
              </div>
            </CardSection>
          )}
        </div>

        {/* 3. RIGHT SIDEBAR (Identity & Location) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Identity Records</h4>
            <div className="space-y-4">
              <InfoItem label="Official Email" value={user.email} icon={Mail} />
              <InfoItem label="Primary Phone" value={user.mobile} icon={Phone} />
              <InfoItem label="Secondary Phone" value={user.secondaryPhone} icon={Phone} />
              <InfoItem label="License Number" value={user.licenseNumber} icon={Landmark} />
              <InfoItem label="Affiliated Hospital" value={user.hospitalOrClinic} icon={Building2} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Location Details</h4>
            <div className="space-y-4">
              <InfoItem label="Address" value={user.address} icon={MapPin} />
              <InfoItem label="City / State" value={`${user.city}, ${user.state}`} />
              <InfoItem label="Country" value={user.country} icon={Globe} />
            </div>
          </div>

          {user.organizationName && (
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Organization</p>
               <h4 className="text-lg font-bold">{user.organizationName}</h4>
               <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  <ShieldCheck size={12} className="text-emerald-400" /> Professional Entity
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. EDIT DRAWER MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Edit Professional Records</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Updates will reflect across all events</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-8 space-y-10">
              
              {/* BASIC INFO */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-50 pb-2">Basic Identity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <EditInput label="Prefix" value={editData.prefix} onChange={(v) => setEditData({...editData, prefix: v})} />
                  <EditInput label="First Name" value={editData.firstName} onChange={(v) => setEditData({...editData, firstName: v})} />
                  <EditInput label="Last Name" value={editData.lastName} onChange={(v) => setEditData({...editData, lastName: v})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <EditInput label="Specialization" value={editData.specialization} onChange={(v) => setEditData({...editData, specialization: v})} />
                  <EditInput label="License Number" value={editData.licenseNumber} onChange={(v) => setEditData({...editData, licenseNumber: v})} />
                </div>
              </div>

              {/* EXPERIENCE LIST EDITOR */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                  <h3 className="text-xs font-black uppercase text-indigo-600">Career History</h3>
                  <button type="button" onClick={() => {
                    const newExp = { employer: "", designation: "", startDate: "", endDate: "", description: "" };
                    setEditData({...editData, professionalExperiences: [...(editData.professionalExperiences || []), newExp]});
                  }} className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all">
                    <Plus size={14}/> Add Position
                  </button>
                </div>
                <div className="space-y-4">
                  {editData.professionalExperiences?.map((exp, idx) => (
                    <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 relative group">
                      <button type="button" onClick={() => {
                        const filtered = editData.professionalExperiences.filter((_, i) => i !== idx);
                        setEditData({...editData, professionalExperiences: filtered});
                      }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <EditInput label="Employer" value={exp.employer} onChange={(v) => {
                          const updated = [...editData.professionalExperiences]; updated[idx].employer = v; setEditData({...editData, professionalExperiences: updated});
                        }} />
                        <EditInput label="Designation" value={exp.designation} onChange={(v) => {
                          const updated = [...editData.professionalExperiences]; updated[idx].designation = v; setEditData({...editData, professionalExperiences: updated});
                        }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <EditInput label="Start Date" type="date" value={exp.startDate} onChange={(v) => {
                          const updated = [...editData.professionalExperiences]; updated[idx].startDate = v; setEditData({...editData, professionalExperiences: updated});
                        }} />
                        <EditInput label="End Date" type="date" value={exp.endDate} onChange={(v) => {
                          const updated = [...editData.professionalExperiences]; updated[idx].endDate = v; setEditData({...editData, professionalExperiences: updated});
                        }} />
                      </div>
                      <EditInput label="Description" textarea value={exp.description} onChange={(v) => {
                        const updated = [...editData.professionalExperiences]; updated[idx].description = v; setEditData({...editData, professionalExperiences: updated});
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* EDUCATION & ORG */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase text-indigo-600 border-b border-indigo-50 pb-2">Academic & Location</h3>
                <div className="grid grid-cols-2 gap-4">
                  <EditInput label="Primary Education" value={editData.education} onChange={(v) => setEditData({...editData, education: v})} />
                  <EditInput label="Higher Education" value={editData.higherEducation} onChange={(v) => setEditData({...editData, higherEducation: v})} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <EditInput label="City" value={editData.city} onChange={(v) => setEditData({...editData, city: v})} />
                  <EditInput label="State" value={editData.state} onChange={(v) => setEditData({...editData, state: v})} />
                  <EditInput label="Country" value={editData.country} onChange={(v) => setEditData({...editData, country: v})} />
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-100 flex gap-4 bg-white sticky bottom-0">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-4 text-xs font-bold text-slate-500 uppercase border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">Discard Changes</button>
              <button onClick={handleUpdate} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
                Commit Synchronization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- HELPERS --- */
const StatBox = ({ label, value }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
    <p className="text-xl font-black text-slate-800 tracking-tight">{value ?? 0}</p>
  </div>
);

const EditInput = ({ label, value, onChange, type = "text", textarea = false }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {textarea ? (
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all min-h-[80px]" />
    ) : (
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all" />
    )}
  </div>
);