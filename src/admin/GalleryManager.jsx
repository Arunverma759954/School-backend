import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Maximize2,
    X,
    Upload,
    CheckCircle2,
    Search,
    Edit,
    RefreshCw,
    Clock,
    AlertCircle,
    Camera
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL, API_IMAGE_URL, WEBSITE_URL, getImageUrl, getFallbackImageUrl } from '../constants';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuth();

    // Upload Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [newImageData, setNewImageData] = useState({ alt: '', category: 'General' });
    const [previewUrl, setPreviewUrl] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [deleteId, setDeleteId] = useState(null);

    const API_URL = `${API_BASE_URL}/gallery`;


    const categories = [
        'All', 'Annual Function', 'Competition', 'Sports', 'Yoga',
        'Campus Life', 'Student Activities', 'Training', 'PTA',
        'Teacher Picnic', 'Republic Day', 'General'
    ];


    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            console.log("IMAGES DATA:", data);

            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
            addNotification('Connection to database failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);

    const addNotification = (message, type = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const handleDelete = async () => {
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
                setImages(prev => prev.filter(img => String(img._id) !== String(idToDelete)));
                setDeleteId(null);

                if (res.ok) addNotification('Gallery asset removed');
                else addNotification('Asset already removed', 'info');

                // Force sync
                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);


            } else {
                addNotification('Server rejected deletion', 'error');
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Gallery delete error:", error);
            addNotification('Delete failed. Please try again.', 'error');
            setDeleteId(null);
        }
    };

    const triggerFileSelect = () => {
        document.getElementById('gallery-file-input').click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setNewImageData({ ...newImageData, alt: file.name.split('.')[0] });
            setIsModalOpen(true);
        }
    };

    const handlePublish = async () => {
        setIsUploading(true);

        try {
            const fileInput = document.getElementById('gallery-file-input');
            const file = fileInput.files[0];

            if (!file) {
                addNotification('Please select a file first', 'error');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('image', file);
            formData.append('alt', newImageData.alt || 'School Media');
            formData.append('category', newImageData.category || 'General');

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                    // No Content-Type - let browser set multipart boundary
                },
                body: formData
            });

            const data = await res.json();

            setIsUploading(false);
            if (res.ok) {
                setImages(prev => [data, ...prev]);
                setIsModalOpen(false);
                setPreviewUrl('');
                setNewImageData({ alt: '', category: 'General' });
                fileInput.value = '';
                addNotification('Media published to live website gallery');
            } else {
                addNotification(data.message || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setIsUploading(false);
            addNotification('Network error during upload', 'error');
        }
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setEditingImage({ ...editingImage, newFile: file });
        }
    };

    const handleUpdate = async () => {
        if (!editingImage) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('alt', editingImage.alt);
            formData.append('category', editingImage.category);

            if (editingImage.newFile) {
                formData.append('image', editingImage.newFile);
            }

            const res = await fetch(`${API_URL}/${editingImage._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user?.token}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setImages(prev => prev.map(img => img._id === data._id ? data : img));
                setIsEditModalOpen(false);
                setEditingImage(null);
                setPreviewUrl('');
                addNotification('Asset updated successfully', 'success');
                setTimeout(() => fetchImages(), 1000);
            } else {
                addNotification(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            console.error('Critical update failure:', error);
            addNotification('Network error during update', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const filteredImages = filterCategory === 'All'
        ? images
        : images.filter(img => img.category === filterCategory);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="relative">
                    <RefreshCw className="w-16 h-16 text-[#8B0000] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#8B0000] rounded-full animate-ping"></div>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-bold text-xl uppercase tracking-widest leading-none">Initialising Database</p>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-4">Establishing secure connection to school servers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Hidden Input */}
            <input
                type="file"
                id="gallery-file-input"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Premium Header Container */}
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                                <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                                Authenticated
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 text-slate-500 text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                V3.2.0-PRO
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                            Media <span className="text-[#8B0000]">Directory</span>
                        </h2>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[7px] mt-1.5 opacity-60">Professional Asset Management Console</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchImages}
                            className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:text-[#8B0000] transition-all border border-slate-100 dark:border-slate-700 group"
                        >
                            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-3 bg-[#8B0000] hover:bg-red-950 text-white px-6 py-3.5 rounded-xl font-bold text-[10px] tracking-widest shadow-lg shadow-rose-100 dark:shadow-none transition-all active:scale-95 group border-b-4 border-red-950"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            IMAGE UPLOAD
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Controls & Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" size={20} />
                        <select
                            className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-2 border-slate-100 dark:border-slate-800 rounded-3xl pl-16 pr-8 py-5 font-bold text-[11px] text-slate-900 dark:text-white uppercase tracking-widest outline-none focus:border-[#8B0000] transition-all appearance-none cursor-pointer"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-white dark:bg-slate-900">
                                    {cat.toUpperCase()} {cat !== 'All' ? `(${images.filter(i => i.category === cat).length})` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <Maximize2 size={14} className="rotate-45" />
                        </div>
                    </div>
                    <div className="px-10 py-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border-2 border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <Clock className="text-slate-400" size={18} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tracking {filteredImages.length} active assets</span>
                    </div>
                </div>
            </div>

            {/* Ultra Modern Table Container */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Visual Preview</th>
                                <th className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Asset Details</th>
                                <th className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Categorization</th>
                                <th className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Deployed On</th>
                                <th className="px-8 py-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] text-right">Administrative</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {filteredImages.map((img, idx) => (
                                <tr key={img._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="relative h-20 w-32 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-xl transition-all group-hover:-translate-y-1">

                                            <img
                                                src={getImageUrl(img.src)}   // ✅ BEST
                                                alt={img.alt}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => getFallbackImageUrl(e, img.src)}
                                            />

                                            <button
                                                onClick={() => setSelectedImg(img)}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                            >
                                                <Maximize2 size={16} />
                                            </button>

                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-white uppercase tracking-normal group-hover:text-[#8B0000] transition-colors">{img.alt || 'Unnamed Document'}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">UUID: {img._id.slice(-8)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase tracking-widest border border-slate-200/50 dark:border-slate-700 transition-all group-hover:bg-[#8B0000] group-hover:text-white group-hover:border-[#8B0000]">
                                            {img.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{new Date(img.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-0.5">{new Date(img.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingImage(img);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-3 bg-white dark:bg-slate-800 text-[#8B0000] rounded-xl hover:bg-[#8B0000] hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-800"
                                                title="Edit Asset"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedImg(img)}
                                                className="p-3 bg-white dark:bg-slate-800 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-800"
                                                title="Full Preview"
                                            >
                                                <Maximize2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(img._id)}
                                                className="p-3 bg-white dark:bg-slate-800 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100 dark:border-slate-800"
                                                title="Delete Asset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredImages.length === 0 && (
                        <div className="py-32 text-center bg-slate-50/50 dark:bg-slate-800/10">
                            <ImageIcon className="w-20 h-20 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
                            <p className="text-slate-400 font-extrabold uppercase tracking-[0.4em] text-xs">No media assets found in this sector</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal (Redesigned) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 border border-slate-200 dark:border-slate-800">
                        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                                <div className="p-2 bg-[#8B0000] rounded-lg text-white"><Upload size={18} /></div>
                                New Asset
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all">
                                <X size={18} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 pb-10 space-y-6">
                            <div
                                className="relative aspect-video rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group cursor-pointer hover:border-sky-500 transition-all font-sans"
                                onClick={triggerFileSelect}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-[#8B0000]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-300">
                                            <span className="bg-white text-[#8B0000] px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl">Change</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <ImageIcon size={32} />
                                        <p className="font-black text-[9px] uppercase tracking-widest">Select Media</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Label Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                        value={newImageData.alt}
                                        onChange={(e) => setNewImageData({ ...newImageData, alt: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Category Sector</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-[12px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all cursor-pointer appearance-none"
                                        value={newImageData.category}
                                        onChange={(e) => setNewImageData({ ...newImageData, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest">Discard</button>
                                <button onClick={handlePublish} disabled={isUploading || !newImageData.alt} className="flex-[2] bg-[#8B0000] hover:bg-red-950 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 text-[10px] uppercase tracking-widest border-b-4 border-sky-800">
                                    {isUploading ? 'Publishing...' : 'Deploy Asset'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingImage && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setIsEditModalOpen(false)}
                    ></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in slide-in-from-bottom-20 duration-500 border border-white/10">
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                                <span className="p-3 bg-[#8B0000] rounded-xl text-white shadow-lg"><Edit size={24} /></span>
                                Edit Asset Record
                            </h3>
                            <p className="text-slate-500 mt-1 font-bold uppercase tracking-[0.2em] text-[8px] opacity-60">Update live production metadata</p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div
                                className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group cursor-pointer"
                                onClick={() => document.getElementById('edit-gallery-file-input').click()}
                            >
                                <img
                                    src={previewUrl || getImageUrl(editingImage.src)}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Preview"
                                    onError={(e) => getFallbackImageUrl(e, editingImage.src)}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                                    <Camera size={32} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Change Photo</span>
                                </div>
                                <input
                                    type="file"
                                    id="edit-gallery-file-input"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleEditFileChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Media Label</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all"
                                        value={editingImage.alt}
                                        onChange={(e) => setEditingImage({ ...editingImage, alt: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Sector Category</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-5 py-4 font-bold text-[13px] text-slate-900 dark:text-white outline-none focus:border-[#8B0000] transition-all cursor-pointer appearance-none"
                                        value={editingImage.category}
                                        onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/50 flex gap-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-white dark:bg-slate-900 text-slate-400 font-bold py-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 tracking-widest text-[10px]"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUploading || !editingImage.alt}
                                className="flex-[2] bg-[#8B0000] hover:bg-red-950 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 border-b-4 border-sky-800 tracking-widest text-[10px]"
                            >
                                {isUploading ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={16} />
                                        UPDATING...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} />
                                        UPDATE ASSET
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Lightbox */}
            {selectedImg && (
                <div className="fixed inset-0 z-[150] bg-slate-950/98 flex items-center justify-center p-4 sm:p-20 animate-in fade-in duration-500 backdrop-blur-3xl">
                    <button
                        onClick={() => setSelectedImg(null)}
                        className="absolute top-10 right-10 p-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] transition-all border border-white/10 hover:scale-110"
                    >
                        <X size={32} />
                    </button>
                    <div className="max-w-7xl w-full h-full flex flex-col items-center justify-center gap-12">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-white/10 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            <img
                                src={getImageUrl(selectedImg.src)}
                                alt={selectedImg.alt}
                                className="relative max-h-[70vh] max-w-full rounded-[3rem] shadow-[0_0_100px_rgba(255,255,255,0.1)] object-contain border-4 border-white/10 animate-in zoom-in-95 duration-1000"
                                onError={(e) => getFallbackImageUrl(e, selectedImg.src)}
                            />
                        </div>
                        <div className="text-center">
                            <span className="bg-[#8B0000] text-white text-[11px] font-bold px-10 py-4 rounded-2xl uppercase tracking-[0.4em] shadow-2xl shadow-sky-900/40 border border-sky-400/30">
                                {selectedImg.category}
                            </span>
                            <h3 className="text-5xl md:text-6xl font-bold text-white mt-10 tracking-tighter uppercase max-w-4xl leading-tight">{selectedImg.alt || 'Asset Record'}</h3>
                            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mt-6">Securely stored since {new Date(selectedImg.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toasts */}
            <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-2">
                {notifications.map(n => (
                    <div key={n.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl border animate-in slide-in-from-right-10 duration-500 bg-white dark:bg-slate-900 ${n.type === 'error' ? 'border-rose-500/20 text-rose-500' : 'border-sky-500/20 text-[#8B0000]'}`}>
                        {n.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-wider">{n.message}</span>
                    </div>
                ))}
            </div>

            {/* Custom Delete Confirmation Modal */}
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
                                <button onClick={handleDelete} className="flex-1 px-8 py-4 bg-[#8B0000] text-white font-bold rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 shadow-xl shadow-rose-200/20 transition-all active:scale-95">Purge Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;
