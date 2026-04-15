import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    User, 
    Mail, 
    Phone, 
    Calendar,
    CheckCircle,
    Clock,
    Search,
    Filter,
    Trash2,
    Maximize2,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL } from '../constants';

const EnquiryManager = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/enquiries`;

    useEffect(() => {
        fetchEnquiries();
    }, [user]);

    const fetchEnquiries = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            const data = await res.json();
            setEnquiries(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch enquiries:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = async () => {
        const idToDelete = deleteId;
        if (!idToDelete) return;
        
        try {
            const res = await fetch(`${API_URL}/${idToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user?.token}` }
            });
            if (res.ok || res.status === 404) {
                setEnquiries(prev => prev.filter(e => String(e._id) !== String(idToDelete)));
                setDeleteId(null);
                
                // Force sync
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                setDeleteId(null);
            }
        } catch (err) {
            console.error("Delete failed:", err);
            setDeleteId(null);
        }
    };

    const filtered = enquiries.filter(enq => 
        (enq.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enq.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enq.parentName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header Section */}
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center gap-1.5 bg-rose-50 text-[#8B0000] text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-sky-100 dark:bg-rose-500/10 dark:border-rose-500/20">
                                <span className="h-1 w-1 rounded-full bg-rose-500 animate-pulse"></span>
                                Live Leads
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                ADMISSION HUB
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                            Admission <span className="text-[#8B0000]">Leads</span>
                        </h2>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[9px] mt-2">Institutional enquiry management system</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative group/search w-full sm:w-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#8B0000] transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search Leads..."
                                className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3.5 font-bold text-[10px] text-slate-900 dark:text-white uppercase tracking-widest outline-none focus:border-#8B0000 transition-all shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={fetchEnquiries}
                            className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-[#8B0000] transition-all border border-slate-100 dark:border-slate-700 group"
                        >
                            <ArrowUpRight size={18} className="group-active:translate-x-1 group-active:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-#8B0000/10 text-[#8B0000] flex items-center justify-center border border-#8B0000/10"><MessageSquare size={24} /></div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Leads</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{enquiries.length}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/10"><Clock size={24} /></div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending Sync</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">0</p>
                    </div>
                </div>
            </div>

            {/* Premium Leads Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Applicant Profile</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact Details</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Request Analysis</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filtered.map((enq) => (
                                <tr key={enq._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-rose-50 dark:bg-sky-900/20 text-[#8B0000] flex items-center justify-center border border-sky-100/50 shrink-0 group-hover:scale-110 transition-transform">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-[#8B0000] transition-colors leading-tight">
                                                    {enq.studentName || 'PROSPECTIVE STUDENT'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-800 w-fit">
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">Guardian/Parent</span>
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 capitalize">{enq.parentName || 'Unknown'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-3">
                                                <Mail size={12} className="text-slate-300" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{enq.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={12} className="text-slate-300" />
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{enq.phone || 'NO-CONTACT'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-md">CLASS</span>
                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{enq.classApplying}</span>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest w-fit border ${
                                                enq.status === 'New' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                {enq.status || 'Received'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(enq.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5 whitespace-nowrap">{new Date(enq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                                            <button 
                                                onClick={() => setSelectedEnquiry(enq)}
                                                className="p-3.5 bg-white dark:bg-slate-800 text-[#8B0000] rounded-xl hover:bg-#8B0000 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-800"
                                                title="Read Message"
                                            >
                                                <Maximize2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteId(enq._id)}
                                                className="p-3.5 bg-white dark:bg-slate-800 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-800"
                                                title="Invalidate Lead"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-800/10">
                            <MessageSquare className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-400 font-extrabold uppercase tracking-[0.4em] text-xs">No admission enquiries present in database</p>
                        </div>
                    )}
                </div>
            </div>

            {/* lead Details Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedEnquiry(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-500 border border-white/10">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center text-left">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Request Overview</h3>
                                    <p className="text-slate-500 mt-1 font-bold uppercase tracking-widest text-[8px] opacity-60">Full enquiry details and parental contact</p>
                                </div>
                                <button onClick={() => setSelectedEnquiry(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-8 text-left">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1 text-left">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Student Candidate</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{selectedEnquiry.studentName}</p>
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Target Class</p>
                                    <p className="text-lg font-bold text-[#8B0000] uppercase">{selectedEnquiry.classApplying}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-left">
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <MessageSquare size={12} className="text-[#8B0000]" /> Parental Message 
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic font-medium">"{selectedEnquiry.message}"</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-left">
                                    <Mail className="text-[#8B0000]" size={18} />
                                    <div>
                                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{selectedEnquiry.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-left">
                                    <Phone className="text-[#8B0000]" size={18} />
                                    <div>
                                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Direct Contact</p>
                                        <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{selectedEnquiry.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                            <button 
                                onClick={() => handleDelete(selectedEnquiry._id)}
                                className="flex-1 bg-white dark:bg-slate-900 text-rose-500 font-bold py-4 rounded-xl hover:bg-rose-50 transition-all border border-slate-200 dark:border-slate-700 tracking-widest text-[10px]"
                            >
                                DELETE LEAD
                            </button>
                            <button 
                                onClick={() => setSelectedEnquiry(null)}
                                className="flex-[2] bg-#8B0000 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] border-b-4 border-sky-800 tracking-widest text-[10px]"
                            >
                                MARK AS RESPONDED
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
                        <div className="p-10 text-center">
                            <div className="h-20 w-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Trash2 size={32} className="text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Confirm Deletion?</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">This record will be permanently purged from the registry.</p>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-8 py-4 bg-[#8B0000] text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 shadow-xl shadow-rose-200/20 transition-all active:scale-95">Purge Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-white/20">
                        <div className="p-10 text-center">
                            <div className="h-20 w-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <Trash2 size={32} className="text-rose-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Confirm Deletion?</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">This record will be permanently purged from the registry.</p>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-8 py-4 bg-[#8B0000] text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 shadow-xl shadow-rose-200/20 transition-all active:scale-95">Purge Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryManager;
