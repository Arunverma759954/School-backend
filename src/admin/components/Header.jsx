import React from 'react';
import { Search, Bell, Menu, User, Sun, Moon, MessageSquare, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useColorMode from '../../hooks/useColorMode';
import { useAuth } from '../../hooks/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const [colorMode, setColorMode] = useColorMode();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userDisplayName = user?.name || 'Administrator';
    const userRole = user?.role || 'Admin';
    const userEmail = user?.email || 'admin@school.com';
    const userAvatar = 'https://i.pinimg.com/564x/7f/6c/64/7f6c64f2d6c4f7f1f8c6f5c2cda6a0c4.jpg';

    return (
        <header className="sticky top-0 z-40 flex w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-grow items-center justify-between px-8 py-5">
                <div className="flex items-center gap-4 lg:hidden">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSidebarOpen(!sidebarOpen);
                        }}
                        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800 transition-all hover:scale-110 active:scale-95"
                    >
                        <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                <div className="hidden sm:block">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-[#8B0000] transition-all group-focus-within:scale-110" />
                        <input
                            type="text"
                            placeholder="Find students, teachers, or records..."
                            className="w-80 lg:w-96 rounded-2xl border-2 border-slate-50 bg-slate-50 py-3 pl-14 pr-6 text-sm font-semibold outline-none transition-all focus:border-[#8B0000] focus:bg-white focus:ring-4 focus:ring-rose-50 dark:border-slate-900 dark:bg-slate-900 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-500/10 placeholder:text-slate-300 shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 border-r-2 border-slate-50 pr-6 dark:border-slate-900">
                        {/* Theme Toggler */}
                        <button
                            onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-[#8B0000] dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-all font-bold hover:scale-110 active:scale-90"
                        >
                            {colorMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Notifications */}
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-[#8B0000] dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-all hover:scale-110 active:scale-90">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
                            </span>
                        </button>

                        {/* Messages */}
                        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-[#8B0000] dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-all font-bold hover:scale-110 active:scale-90">
                            <MessageSquare className="h-5 w-5" />
                        </button>
                    </div>

                    {/* User Area */}
                    <div className="relative flex items-center gap-4 pl-2 group">
                        <div
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="hidden text-right lg:block cursor-pointer select-none"
                        >
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#8B0000] transition-colors uppercase tracking-tight">{userDisplayName}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                {userRole}
                            </p>
                        </div>

                        <div className="relative">
                            <div
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="h-10 w-10 rounded-xl bg-rose-50 overflow-hidden border-2 border-white shadow-xl ring-2 ring-slate-50 hover:ring-rose-200 dark:ring-slate-900 dark:border-slate-800 transition-all cursor-pointer hover:scale-105 active:scale-95 text-xs flex items-center justify-center font-bold text-rose-800"
                            >
                                <img src={userAvatar} alt="User" className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <ChevronDown
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`h-4 w-4 text-slate-400 hover:text-[#8B0000] cursor-pointer transition-all duration-300 ${dropdownOpen ? 'rotate-180 text-[#8B0000]' : ''}`}
                        />

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-0 h-screen w-screen"
                                    onClick={() => setDropdownOpen(false)}
                                ></div>

                                <div className="absolute right-0 top-full z-50 mt-6 w-80 rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-950 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 ease-out origin-top-right">
                                    <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950"></div>

                                    {/* Dropdown Header */}
                                    <div className="flex items-center gap-4 px-6 py-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] mb-3 relative z-10 border border-slate-50 dark:border-slate-900/50 overflow-hidden">
                                        <div className="absolute -right-8 -top-8 h-24 w-24 bg-sky-600/5 rounded-full blur-2xl"></div>
                                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                            <User className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <p className="text-base font-bold text-slate-900 dark:text-white truncate uppercase tracking-tight">{userDisplayName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5 tracking-widest">{userEmail}</p>
                                        </div>
                                    </div>

                                    {/* Actions List */}
                                    <ul className="flex flex-col gap-2 relative z-10 p-2">
                                        <li>
                                            <button
                                                onClick={() => { navigate('/admin/profile'); setDropdownOpen(false); }}
                                                className="flex w-full items-center gap-4 px-5 py-4 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-sky-400 transition-all rounded-2xl group uppercase tracking-widest"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/40 transition-all">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                Global Profile
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => { navigate('/admin/settings'); setDropdownOpen(false); }}
                                                className="flex w-full items-center gap-4 px-5 py-4 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-sky-400 transition-all rounded-2xl group uppercase tracking-widest"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/40 transition-all">
                                                    <Settings className="h-5 w-5" />
                                                </div>
                                                System Config
                                            </button>
                                        </li>
                                        <li className="my-2 border-t border-slate-50 dark:border-slate-900 mx-4"></li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-4 px-5 py-5 text-xs font-bold text-rose-500 bg-rose-50/30 hover:bg-rose-50 dark:bg-rose-900/5 dark:text-rose-400 dark:hover:bg-rose-900/20 transition-all rounded-2xl group uppercase tracking-[0.2em] border border-rose-100/30 dark:border-rose-900/20"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/50 dark:bg-rose-900/30 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                    <LogOut className="h-5 w-5" />
                                                </div>
                                                Terminate Session
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
