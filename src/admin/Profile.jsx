import React, { useEffect, useState } from 'react';
import { Breadcrumb } from './components/Breadcrumb';
import { Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Twitter, Facebook, Linkedin, Camera } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState({
        name: 'Arun Verma',
        role: 'School Administrator',
        email: 'arunverma7599@gmail.com',
        avatar: 'https://i.pravatar.cc/300?img=11',
        phone: '+91 98765 43210',
        location: 'Jharsuguda, Odisha',
        posts: '42',
        followers: '850',
        following: '120'
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(prev => ({ ...prev, ...JSON.parse(storedUser) }));
        }
    }, []);

    return (
        <>
            <Breadcrumb pageName="Administrator Profile" />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-visible mt-4">
                {/* Cover Image */}
                <div className="relative h-48 md:h-64 rounded-t-2xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2670&auto=format&fit=crop"
                        alt="profile cover"
                        className="h-full w-full object-cover object-center"
                    />
                    <div className="absolute bottom-4 right-4 z-10">
                        <label
                            htmlFor="cover"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-600 py-1.5 px-4 text-sm font-medium text-white hover:bg-sky-700 transition-colors shadow-lg"
                        >
                            <Camera className="h-4 w-4" />
                            <span>Edit Cover</span>
                        </label>
                        <input type="file" name="cover" id="cover" className="sr-only" />
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="px-6 pb-8 text-center lg:pb-10 relative">
                    {/* Profile Picture */}
                    <div className="relative mx-auto -mt-20 h-32 w-32 rounded-full ring-4 ring-white dark:ring-slate-900 bg-white dark:bg-slate-900 p-1 shadow-md z-20">
                        <div className="relative h-full w-full rounded-full overflow-hidden">
                            <img src={user.avatar} alt="profile" className="w-full h-full object-cover" />
                        </div>
                        <label
                            htmlFor="profile"
                            className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-700 ring-2 ring-white dark:ring-slate-900 transition-colors shadow-md z-30"
                        >
                            <Camera className="h-4 w-4" />
                            <input type="file" name="profile" id="profile" className="sr-only" />
                        </label>
                    </div>

                    <div className="mt-5">
                        <h3 className="mb-1.5 text-2xl font-bold text-slate-900 dark:text-white">
                            {user.name}
                        </h3>
                        <p className="font-medium text-slate-500 flex items-center justify-center gap-2 mb-6">
                            <Briefcase className="w-4 h-4" /> {user.role}
                        </p>

                        {/* Stats Grid */}
                        <div className="mx-auto mt-4 mb-8 grid max-w-sm grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 bg-slate-50 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="font-bold text-slate-900 dark:text-white text-lg">
                                    {user.posts || '42'}
                                </span>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Updates</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="font-bold text-slate-900 dark:text-white text-lg">
                                    {user.followers || '850'}
                                </span>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Staff</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4">
                                <span className="font-bold text-slate-900 dark:text-white text-lg">
                                    {user.following || '120'}
                                </span>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Groups</span>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mx-auto max-w-2xl px-4">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-3 text-sky-600">
                                About Me
                            </h4>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                Dedicated School Administrator with over 10 years of experience in managing educational institutions. 
                                Specializing in student welfare, faculty management, and digital transformation of academic processes. 
                                Committed to maintaining the high standards of St. Joseph's Convent School.
                            </p>
                        </div>

                        {/* Contact Details Grid */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Email Address</p>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Phone Number</p>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{user.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Location</p>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{user.location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                                    <LinkIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Official Website</p>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">stjosephsjharsuguda.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8">
                            <h4 className="mb-4 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                                Official Portals
                            </h4>
                            <div className="flex items-center justify-center gap-4">
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:border-sky-600 hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-sky-600 transition-all shadow-sm">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:border-sky-600 hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-sky-600 transition-all shadow-sm">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:border-sky-600 hover:bg-sky-600 hover:text-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-sky-600 transition-all shadow-sm">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
