import React, { useState, useEffect } from 'react';
import {
    FileText,
    Plus,
    Trash2,
    Search,
    User,
    GraduationCap,
    Clock,
    X,
    CheckCircle2,
    Edit,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL, API_IMAGE_URL, getImageUrl, getFallbackImageUrl } from '../constants';

const TCManager = () => {
    const [tcs, setTcs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTC, setNewTC] = useState({ studentName: '', admissionNo: '', issueDate: '', className: '', tcNumber: '' });
    const [editTC, setEditTC] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tcPreview, setTcPreview] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/tc`;

    useEffect(() => {
        fetchTCs();
    }, [user]);

    const fetchTCs = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setTcs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch TCs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newTC).forEach(key => formData.append(key, newTC[key]));
            if (selectedFile) formData.append('image', selectedFile);

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setTcs(prev => [data, ...prev]);
                closeModal();
                addNotification('TC Certificate issued successfully');
            } else {
                addNotification('Failed to issue certificate', 'error');
            }
        } catch (err) {
            console.error("Failed to create TC:", err);
            addNotification('Network error', 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(editTC).forEach(key => {
                if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
                    formData.append(key, editTC[key]);
                }
            });
            if (selectedFile) formData.append('image', selectedFile);

            const res = await fetch(`${API_URL}/${editTC._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setTcs(prev => prev.map(tc => tc._id === data._id ? data : tc));
                closeModal();
                addNotification('Record updated successfully');
            } else {
                addNotification('Failed to update record', 'error');
            }
        } catch (err) {
            console.error("Failed to update TC:", err);
            addNotification('Network error', 'error');
        }
    };

    const handleDelete = async () => {
        const idToDelete = deleteId;
        if (!idToDelete) return;
        
        console.log("Initiating final removal for ID:", idToDelete);
        
        try {
            const res = await fetch(`${API_URL}/${idToDelete}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            
            if (res.ok || res.status === 404) {
                // If it's 200 or 404 (already gone), we clean up
                setTcs(prev => prev.filter(tc => String(tc._id) !== String(idToDelete)));
                setDeleteId(null);
                
                if (res.ok) addNotification('Record removed from registry');
                else addNotification('Sync error: Record already removed', 'info');

                // Force a clean reload to sync everything
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                const errorData = await res.json().catch(() => ({}));
                addNotification(errorData.message || 'Server rejected removal', 'error');
                setDeleteId(null); // Close modal anyway to prevent stuck UI
            }
        } catch (err) {
            console.error("Delete operation failed:", err);
            addNotification('Network error. Record remains.', 'error');
        }
    };

    const openEditModal = (tc) => {
        setEditTC({
            ...tc,
            issueDate: tc.issueDate ? new Date(tc.issueDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditTC(null);
        setSelectedFile(null);
        setTcPreview(null);
        setNewTC({ studentName: '', admissionNo: '', issueDate: '', className: '', tcNumber: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setTcPreview(URL.createObjectURL(file));
        }
    };

    const filteredTCs = tcs.filter(tc => {
        const name = tc?.studentName || '';
        const adm = tc?.admissionNo || '';
        const search = searchQuery?.toLowerCase() || '';
        return name.toLowerCase().includes(search) || adm.toLowerCase().includes(search);
    });

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header Section */}
            <div className="relative">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                                Secured Registry
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                V4.2.0-PRO
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                            Certificate <span className="text-[#8B0000]">Registry</span>
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[7px] mt-2 opacity-60">Secured institutional record management system</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative group/search w-full sm:w-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-sky-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search Name/Admin..."
                                className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3.5 font-bold text-[10px] text-slate-900 dark:text-white uppercase tracking-widest outline-none focus:border-sky-600 transition-all shadow-inner"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#8B0000] hover:bg-red-900 text-white px-8 py-3.5 rounded-xl font-bold text-[10px] tracking-widest shadow-lg shadow-rose-100 dark:shadow-none transition-all active:scale-95 group border-b-4 border-red-950 relative z-20"
                        >
                            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                            TC UPLOAD
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 text-[#8B0000] flex items-center justify-center border border-rose-100"><GraduationCap size={20} /></div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Issued</p>
                        <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{tcs.length}</p>
                    </div>
                </div>
            </div>

            {/* Premium Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Student Profile</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administrative ID</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Academic Class</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issue Authorization</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Records Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredTCs.map((tc, index) => (
                                <tr 
                                    key={tc._id} 
                                    className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-white/10 overflow-hidden shrink-0 group-hover:shadow-xl transition-all group-hover:-translate-y-1 relative">
                                                {tc?.imageFile ? (
                                                    <img
                                                        src={getImageUrl(tc.imageFile)}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt={tc?.studentName || 'Student'}
                                                        onError={(e) => getFallbackImageUrl(e, tc.imageFile)}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-semibold text-slate-700 dark:text-white uppercase tracking-normal group-hover:text-[#8B0000] transition-colors">{tc?.studentName || 'Unknown Student'}</p>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1 opacity-70">
                                                    <CheckCircle2 size={10} className="text-emerald-500" /> Digital Verification
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-md">ADM</span>
                                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">{tc?.admissionNo || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-md">CERT</span>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{tc?.tcNumber || 'PENDING'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                                            {tc?.className || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                                                {tc?.issueDate ? new Date(tc.issueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mt-1 whitespace-nowrap">Authorized Entry</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(tc)}
                                                className="p-3.5 bg-white dark:bg-slate-800 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                                title="Edit Record"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(tc._id)}
                                                className="p-3 bg-white dark:bg-slate-800 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTCs.length === 0 && (
                        <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-800/10">
                            <FileText className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-400 font-extrabold uppercase tracking-[0.4em] text-xs">No certificate records matching criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-slate-200 dark:border-slate-800">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                                <div className="p-2 bg-sky-600 rounded-lg text-white"><FileText size={18} /></div>
                                {editTC ? 'Edit Certificate' : 'New Registry'}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={editTC ? handleUpdate : handleCreate} className="p-8 pb-10 space-y-6">
                            {/* Photo Upload Area */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-sky-500 transition-colors group"
                                onClick={() => document.getElementById('studentPhoto')?.click()}>
                                <div className="h-16 w-16 rounded-xl bg-white dark:bg-slate-900 border overflow-hidden flex items-center justify-center text-slate-300">
                                    {tcPreview ? (
                                        <img src={tcPreview} className="w-full h-full object-cover" />
                                    ) : (editTC?.imageFile) ? (
                                        <img
                                            src={(() => {
                                                if (!editTC.imageFile) return '';
                                                if (editTC.imageFile.startsWith('http') || editTC.imageFile.startsWith('data:')) return editTC.imageFile;
                                                let path = editTC.imageFile;
                                                if (path.startsWith('/uploads/Gallery/TC/')) {
                                                    path = path.replace('/uploads/Gallery/TC/', '/Gallery/TC/');
                                                }
                                                return encodeURI(path.startsWith('/')
                                                    ? `${API_IMAGE_URL}${path}`
                                                    : `${API_IMAGE_URL}/Gallery/TC/${path}`);
                                            })()}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon size={20} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-sky-600">Student Portrait</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Click to select photo</p>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="studentPhoto" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Student Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-sky-600 transition-all"
                                        value={editTC ? editTC.studentName : newTC.studentName}
                                        onChange={(e) => editTC ? setEditTC({ ...editTC, studentName: e.target.value }) : setNewTC({ ...newTC, studentName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Admission No</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-sky-600"
                                            value={editTC ? editTC.admissionNo : newTC.admissionNo}
                                            onChange={(e) => editTC ? setEditTC({ ...editTC, admissionNo: e.target.value }) : setNewTC({ ...newTC, admissionNo: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Class/Grade</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-sky-600"
                                            value={editTC ? editTC.className : newTC.className}
                                            onChange={(e) => editTC ? setEditTC({ ...editTC, className: e.target.value }) : setNewTC({ ...newTC, className: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Issue Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-sky-600"
                                            value={editTC ? editTC.issueDate : newTC.issueDate}
                                            onChange={(e) => editTC ? setEditTC({ ...editTC, issueDate: e.target.value }) : setNewTC({ ...newTC, issueDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Serial No</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-sky-600"
                                            value={editTC ? editTC.tcNumber : newTC.tcNumber}
                                            onChange={(e) => editTC ? setEditTC({ ...editTC, tcNumber: e.target.value }) : setNewTC({ ...newTC, tcNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="flex-[2] bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-widest border-b-4 border-sky-800">
                                    {editTC ? 'Update Record' : 'Issue Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Toasts */}
            <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2">
                {notifications.map(n => (
                    <div key={n.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl border animate-in slide-in-from-right-10 duration-500 bg-white dark:bg-slate-900 ${n.type === 'error' ? 'border-rose-500/20 text-rose-500' : 'border-sky-500/20 text-sky-600'}`}>
                        {n.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-wider">{n.message}</span>
                    </div>
                ))}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-[280px] rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-5 duration-300 border border-slate-100 dark:border-slate-800 p-6 text-center">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                            <Trash2 size={20} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Delete Record?</h4>
                        <p className="text-[10px] text-slate-400 font-bold mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-400 font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all">No</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-rose-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TCManager;
