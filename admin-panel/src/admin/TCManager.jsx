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

import { API_BASE_URL, API_IMAGE_URL } from '../constants';

const TCManager = () => {
    const [tcs, setTcs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTC, setNewTC] = useState({ studentName: '', admissionNo: '', issueDate: '', className: '', tcNumber: '' });
    const [editTC, setEditTC] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tcPreview, setTcPreview] = useState(null);
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
                setTcs(prev => [...prev, data]);
                closeModal();
            }
        } catch (err) {
            console.error("Failed to create TC:", err);
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
            }
        } catch (err) {
            console.error("Failed to update TC:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this TC record permanently?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                setTcs(prev => prev.filter(tc => tc._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete TC:", err);
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
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                            Certificate <span className="text-[#8B0000]">Registry</span>
                        </h2>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[9px] mt-2">Institutional document control console</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative group/search w-full sm:w-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#8B0000] transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search Name/Admin..."
                                className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-6 py-3.5 font-bold text-[10px] text-slate-900 dark:text-white uppercase tracking-widest outline-none focus:border-[#8B0000] transition-all shadow-inner"
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
                            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#8B0000] hover:bg-red-950 text-white px-8 py-3.5 rounded-xl font-bold text-[10px] tracking-widest shadow-lg shadow-rose-100 dark:shadow-none transition-all active:scale-95 group border-b-4 border-red-950 relative z-20"
                        >
                            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                            TC UPLOAD
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center border border-[#8B0000]/10"><GraduationCap size={24} /></div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Issued</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{tcs.length}</p>
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
                            {filteredTCs.map((tc) => (
                                <tr key={tc._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-white/10 overflow-hidden shrink-0 group-hover:shadow-xl transition-all group-hover:-translate-y-1 relative">
                                                {tc?.imageFile ? (
                                                    <img 
                                                        src={tc.imageFile.startsWith('http') 
                                                            ? tc.imageFile 
                                                            : encodeURI(tc.imageFile.startsWith('/uploads/') 
                                                                ? `${WEBSITE_URL}${tc.imageFile.replace('/uploads/', '/')}`
                                                                : `${API_IMAGE_URL}${tc.imageFile.startsWith('/') ? '' : '/'}${tc.imageFile}`)} 
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                                        alt={tc?.studentName || 'Student'}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const iconDiv = document.createElement('div');
                                                            iconDiv.className = 'absolute inset-0 flex items-center justify-center text-slate-300';
                                                            iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
                                                            e.target.parentElement.appendChild(iconDiv);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-[#8B0000] transition-colors">{tc?.studentName || 'Unknown Student'}</p>
                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                                                    <CheckCircle2 size={10} /> Digital Verification Active
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-md">ADM</span>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{tc?.admissionNo || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest py-0.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-md">CERT</span>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{tc?.tcNumber || 'PENDING'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="inline-flex items-center px-4 py-2 rounded-xl bg-[#8B0000]/5 text-[#8B0000] text-[10px] font-bold uppercase tracking-widest border border-[#8B0000]/10">
                                            {tc?.className || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {tc?.issueDate ? new Date(tc.issueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5 whitespace-nowrap">Authorized Entry</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                                            <button 
                                                onClick={() => openEditModal(tc)}
                                                className="p-3.5 bg-white dark:bg-slate-800 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                                title="Edit Record"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(tc._id)}
                                                className="p-3.5 bg-white dark:bg-slate-800 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                                title="Delete Permanent"
                                            >
                                                <Trash2 size={16} />
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

            {/* Modal - Moved to Bottom Level of Return */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-500 border border-white/10">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                             <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
                                    <span className="p-3 bg-[#8B0000] rounded-xl text-white shadow-lg"><FileText size={24} /></span>
                                    {editTC ? 'Modify Record' : 'Registry Entry'}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                    <X size={20} className="text-slate-400" />
                                </button>
                             </div>
                            <p className="text-slate-500 mt-1 font-bold uppercase tracking-[0.2em] text-[8px] opacity-60">Academic transition authorization system</p>
                        </div>

                        <form onSubmit={editTC ? handleUpdate : handleCreate} className="p-8 space-y-6">
                            {/* Photo Upload Area */}
                            <div className="flex items-center gap-6 p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 group/upload cursor-pointer hover:border-[#8B0000] transition-colors"
                                 onClick={() => document.getElementById('studentPhoto')?.click()}>
                                <div className="h-20 w-20 rounded-xl bg-white dark:bg-slate-900 border-2 overflow-hidden flex items-center justify-center text-slate-200 shadow-inner">
                                    {tcPreview ? (
                                        <img src={tcPreview} className="w-full h-full object-cover" />
                                    ) : (editTC?.imageFile) ? (
                                        <img 
                                            src={editTC.imageFile.startsWith('http') 
                                                ? editTC.imageFile 
                                                : encodeURI(editTC.imageFile.startsWith('/uploads/') 
                                                    ? `${WEBSITE_URL}${editTC.imageFile.replace('/uploads/', '/')}`
                                                    : `${API_IMAGE_URL}${editTC.imageFile.startsWith('/') ? '' : '/'}${editTC.imageFile}`)} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <ImageIcon size={28} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8B0000]">Student Identification</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">Upload verified portrait for registry verification (JPG/PNG)</p>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        id="studentPhoto" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                     <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Full Student Name (Primary Record)</label>
                                     <input 
                                         type="text" 
                                         className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                         placeholder="Ex: ARUN VERMA"
                                         value={editTC ? editTC.studentName : newTC.studentName}
                                         onChange={(e) => editTC ? setEditTC({...editTC, studentName: e.target.value}) : setNewTC({...newTC, studentName: e.target.value})}
                                         required
                                     />
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Admission No</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000]"
                                            placeholder="ADM-0000"
                                            value={editTC ? editTC.admissionNo : newTC.admissionNo}
                                            onChange={(e) => editTC ? setEditTC({...editTC, admissionNo: e.target.value}) : setNewTC({...newTC, admissionNo: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Class Division</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000]"
                                            placeholder="IX-A / XII-Science"
                                            value={editTC ? editTC.className : newTC.className}
                                            onChange={(e) => editTC ? setEditTC({...editTC, className: e.target.value}) : setNewTC({...newTC, className: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">Authorization Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000]"
                                            value={editTC ? editTC.issueDate : newTC.issueDate}
                                            onChange={(e) => editTC ? setEditTC({...editTC, issueDate: e.target.value}) : setNewTC({...newTC, issueDate: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-1">TC Serial No</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000]"
                                            placeholder="TC/2026/0XXX"
                                            value={editTC ? editTC.tcNumber : newTC.tcNumber}
                                            onChange={(e) => editTC ? setEditTC({...editTC, tcNumber: e.target.value}) : setNewTC({...newTC, tcNumber: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all tracking-widest text-[10px]"
                                >
                                    ABORT
                                </button>
                                <button type="submit" className="flex-[2] bg-[#8B0000] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] border-b-4 border-red-950 tracking-widest text-[10px]">
                                    {editTC ? 'COMMIT CHANGES' : 'AUTHORIZE & ISSUE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TCManager;
