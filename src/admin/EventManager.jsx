import React, { useState, useEffect } from 'react';
import { 
    Calendar,
    Plus,
    Trash2,
    MapPin,
    Clock,
    X,
    CheckCircle2,
    Edit
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL } from '../constants';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', location: 'School Campus', description: '', category: 'General' });
    const [deleteId, setDeleteId] = useState(null);
    const { user } = useAuth();
    const API_URL = `${API_BASE_URL}/events`;

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(newEvent)
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(prev => [...prev, data]);
                setIsModalOpen(false);
                setNewEvent({ title: '', date: '', location: 'School Campus', description: '', category: 'General' });
            }
        } catch (err) {
            console.error("Failed to create event:", err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/${editEvent._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(editEvent)
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(prev => prev.map(ev => ev._id === data._id ? data : ev));
                setIsModalOpen(false);
                setEditEvent(null);
            }
        } catch (err) {
            console.error("Failed to update event:", err);
        }
    };

    const confirmDelete = async () => {
        const idToDelete = deleteId;
        if (!idToDelete) return;
        
        try {
            const res = await fetch(`${API_URL}/${idToDelete}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            
            if (res.ok || res.status === 404) {
                setEvents(prev => prev.filter(event => String(event._id) !== String(idToDelete)));
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

    const openEditModal = (event) => {
        setEditEvent({
            ...event,
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditEvent(null);
        setNewEvent({ title: '', date: '', location: 'School Campus', description: '', category: 'General', link: '' });
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header Section */}
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="flex items-center gap-1.5 bg-rose-50 text-[#8B0000] text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20">
                                <span className="h-1 w-1 rounded-full bg-[#8B0000] animate-pulse"></span>
                                Institutional Lifecycle
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                V2.4.0-PRO
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                            Events <span className="text-[#8B0000]">Registry</span>
                        </h2>
                        <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px] mt-2">Scheduled school events and campus logistics</p>
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-3 bg-[#8B0000] hover:bg-red-950 text-white px-6 py-3.5 rounded-xl font-bold text-[10px] tracking-widest shadow-lg shadow-rose-100 dark:shadow-none transition-all active:scale-95 group border-b-4 border-red-950"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        SCHEDULE EVENT
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center border border-[#8B0000]/10"><Calendar size={24} /></div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Events</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{events.length}</p>
                    </div>
                </div>
            </div>

            {/* Premium Table Container */}
            <div className="mx-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border-hidden">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Event Identity</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logistics</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {events.map((event) => (
                                <tr key={event._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-white uppercase tracking-normal group-hover:text-[#8B0000] transition-colors">{event.title}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">ID: {event._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5">Scheduled Date</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500">{event.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-[#8B0000] text-[9px] font-bold uppercase tracking-widest border border-rose-100 dark:border-rose-900/50">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                             <button 
                                                onClick={() => openEditModal(event)}
                                                className="p-3 bg-white dark:bg-slate-800 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setDeleteId(event._id)}
                                                className="p-3 bg-white dark:bg-slate-800 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {events.length === 0 && (
                        <div className="py-24 text-center bg-slate-50/50 dark:bg-slate-800/10">
                            <Calendar className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No scheduled events found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={closeModal} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-500 border border-white/10">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                <span className="p-3 bg-[#8B0000] rounded-xl text-white shadow-lg"><Plus size={20} /></span>
                                {editEvent ? 'Update Event' : 'Schedule Event'}
                            </h3>
                        </div>

                        <form onSubmit={editEvent ? handleUpdate : handleCreate} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Title</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                    placeholder="Ex: Annual Sports Day 2026"
                                    value={editEvent ? editEvent.title : newEvent.title}
                                    onChange={(e) => editEvent ? setEditEvent({...editEvent, title: e.target.value}) : setNewEvent({...newEvent, title: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                        value={editEvent ? editEvent.date : newEvent.date}
                                        onChange={(e) => editEvent ? setEditEvent({...editEvent, date: e.target.value}) : setNewEvent({...newEvent, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                        placeholder="School Campus"
                                        value={editEvent ? editEvent.location : newEvent.location}
                                        onChange={(e) => editEvent ? setEditEvent({...editEvent, location: e.target.value}) : setNewEvent({...newEvent, location: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <select 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all appearance-none cursor-pointer"
                                    value={editEvent ? editEvent.category : newEvent.category}
                                    onChange={(e) => editEvent ? setEditEvent({...editEvent, category: e.target.value}) : setNewEvent({...newEvent, category: e.target.value})}
                                >
                                    <option value="General">General</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Holiday">Holiday</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Link (Optional)</label>
                                <input 
                                    type="url" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                    placeholder="https://example.com/event-details"
                                    value={editEvent ? (editEvent.link || '') : newEvent.link}
                                    onChange={(e) => editEvent ? setEditEvent({...editEvent, link: e.target.value}) : setNewEvent({...newEvent, link: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all tracking-widest text-[10px]"
                                >
                                    DISCARD
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] bg-[#8B0000] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] border-b-4 border-red-950 tracking-widest text-[10px]"
                                >
                                    {editEvent ? 'UPDATE RECORD' : 'SCHEDULE EVENT'}
                                </button>
                            </div>
                        </form>
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

export default EventManager;
