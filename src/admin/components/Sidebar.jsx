import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    ChevronDown,
    Menu,
    CalendarCheck,
    User,
    Users,
    GraduationCap,
    Image as ImageIcon,
    CreditCard,
    BookOpenCheck,
    LogOut,
    HelpCircle,
    Shield,
    MessageSquare,
    FileText,
    Plus,
    FolderOpen,
    Calendar as CalendarIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';
import { API_IMAGE_URL } from '../../constants';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            logout();
            navigate('/login');
        }, 1500);
    };

    const activeItemClass = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold uppercase transition-all duration-300 bg-[#8B0000] text-white shadow-lg shadow-rose-100/50 dark:shadow-none scale-[1.02] relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-white/30";
    const inactiveItemClass = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold uppercase transition-all duration-300 text-slate-500 hover:bg-rose-50/50 hover:text-[#8B0000] dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-rose-400 opacity-90 hover:opacity-100";

    return (
        <aside
            className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden border-r border-slate-100 bg-white duration-300 ease-linear dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* SIDEBAR HEADER */}
            <div className="flex items-center justify-between px-6 py-8 transition-all border-b border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-950">
                <NavLink to="/admin" className="flex items-center gap-3 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md group-hover:scale-110 transition-transform overflow-hidden p-1 border border-slate-100">
                        <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none uppercase">SJCS Portal</h1>
                        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#8B0000] mt-1 opacity-80">Management Console</p>
                    </div>
                </NavLink>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="block rounded-xl p-2.5 text-slate-400 hover:bg-slate-50 lg:hidden transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear px-4 py-4 flex-grow">
                <nav className="flex flex-col gap-8">
                    {/* CORE ADMINISTRATION */}
                    <div>
                        <h3 className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-rose-600"></div>
                            Administrative Core
                        </h3>
                        <ul className="flex flex-col gap-1.5">
                            <li>
                                <NavLink to="/admin" end className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <LayoutDashboard className="h-5 w-5" />
                                    Command Center
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/enquiries" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <MessageSquare className="h-5 w-5" />
                                    Admission Inbox
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/tc" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <FileText className="h-5 w-5" />
                                    TC Manager
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* ACADEMIC RECORDS */}
                    <div>
                        <h3 className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-[#8B0000]"></div>
                            Academic Records
                        </h3>
                        <ul className="flex flex-col gap-1.5">
                            <li>
                                <NavLink to="/admin/students" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <Users className="h-5 w-5" />
                                    Student Data
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/faculty" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <GraduationCap className="h-5 w-5" />
                                    Faculty Hub
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/tests" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <BookOpenCheck className="h-5 w-5" />
                                    Test Analytics
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* MANAGEMENT Group */}
                    <div>
                        <h3 className="mb-4 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-rose-600"></div>
                            Operations Tools
                        </h3>
                        <ul className="flex flex-col gap-1.5">
                            <li>
                                <NavLink to="/admin/gallery" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <ImageIcon className="h-5 w-5" />
                                    Gallery Ops
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin/events" className={({ isActive }) => isActive ? activeItemClass : inactiveItemClass}>
                                    <CalendarCheck className="h-5 w-5" />
                                    Public Events
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Sidebar Footer - Clean Logout */}
            <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isLoggingOut
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm'
                        }`}
                >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${isLoggingOut ? 'bg-rose-100' : 'bg-slate-50 group-hover:bg-rose-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-800'
                        }`}>
                        <LogOut size={16} className={isLoggingOut ? 'animate-pulse' : ''} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[9px]">
                        {isLoggingOut ? 'Terminating...' : 'Secure Logout'}
                    </span>
                </button>

                <div className="mt-4 text-center">
                    <p className="text-[7px] font-bold text-slate-300 dark:text-slate-800 uppercase tracking-[0.3em] leading-relaxed">
                        SJCS-MANAGEMENT-PRO-V4
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
