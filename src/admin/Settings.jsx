import React from 'react';
import { Breadcrumb } from './components/Breadcrumb';
import { Camera, Image, Save, User as UserIcon, Mail, Upload } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    
    // Split name if possible, otherwise use user.name
    const nameParts = (user?.name || 'Administrator').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return (
        <>
            <Breadcrumb pageName="Settings" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">

                    {/* <!-- Personal Information Form --> */}
                    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                        <div className="border-b border-slate-100 py-6 px-8 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter text-lg">
                                <UserIcon className="w-5 h-5 text-sky-600" /> Global Profile
                            </h3>
                        </div>
                        <form action="#">
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2 text-left">
                                        <label className="mb-2.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            defaultValue={firstName}
                                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3 px-5 font-bold text-[13px] text-slate-900 dark:text-white outline-none transition focus:border-sky-600 dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2 text-left">
                                        <label className="mb-2.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            defaultValue={lastName}
                                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3 px-5 font-bold text-[13px] text-slate-900 dark:text-white outline-none transition focus:border-sky-600 dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 text-left">
                                    <label className="mb-2.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="admin@school.com"
                                            defaultValue={user?.email || ''}
                                            className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3 px-5 font-bold text-[13px] text-slate-900 dark:text-white outline-none transition focus:border-sky-600 dark:border-slate-800 dark:bg-slate-900"
                                        />
                                        <Mail className="absolute right-4 top-4 h-5 w-5 opacity-50 text-slate-400" />
                                    </div>
                                </div>

                                <div className="mb-4.5 text-left">
                                    <label className="mb-2.5 block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Professional Bio
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Add your administrative bio..."
                                        className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-3 px-5 font-bold text-[13px] text-slate-900 dark:text-white outline-none transition focus:border-sky-600 dark:border-slate-800 dark:bg-slate-900"
                                        defaultValue=""
                                    ></textarea>
                                </div>

                                <button className="flex justify-center rounded-xl bg-sky-600 py-3 px-8 font-bold text-white hover:bg-black transition-all gap-2 tracking-widest text-[10px] shadow-lg shadow-sky-100 dark:shadow-none uppercase">
                                    <Save className="w-4 h-4" />
                                    Commit Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col gap-9">
                    {/* <!-- Photo Upload Card --> */}
                    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                        <div className="border-b border-slate-100 py-6 px-8 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tighter text-lg">
                                <Image className="w-5 h-5 text-sky-600" /> Administrative Portrait
                            </h3>
                        </div>
                        <div className="p-8">
                            <div className="mb-8 flex items-center gap-4 text-left">
                                <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-xl overflow-hidden ring-4 ring-slate-50 dark:ring-slate-900">
                                    <img src="https://i.pinimg.com/564x/79/11/d1/7911d1767667d4cc7432d0df347a46dd.jpg" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                                        {user?.name || 'Administrator'}
                                    </p>
                                    <p className="flex gap-4 mt-2">
                                        <button className="text-[10px] font-bold text-rose-500 hover:underline uppercase tracking-widest">Delete</button>
                                        <button className="text-[10px] font-bold text-sky-600 hover:underline uppercase tracking-widest">Update</button>
                                    </p>
                                </div>
                            </div>

                            <div id="FileUpload" className="relative mb-8 block w-full cursor-pointer appearance-none rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 px-4 dark:border-slate-700 dark:bg-slate-900 hover:border-sky-600 transition-all">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                />
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                        <Upload className="w-5 h-5 text-sky-600" />
                                    </span>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span className="text-sky-600">Click to upload</span> or drag
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight text-center">SVG, PNG, JPG (MAX. 800x800)</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <button
                                    className="px-8 py-3 rounded-xl border-2 border-slate-100 text-slate-400 hover:bg-slate-50 transition-all"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-8 py-3 rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-100 dark:shadow-none hover:bg-black transition-all"
                                    type="submit"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Settings;
