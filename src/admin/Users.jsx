import React, { useState } from 'react';
import { Breadcrumb } from './components/Breadcrumb';
import { Eye, Edit, Trash2, MoreVertical, Plus, Search, Filter } from 'lucide-react';

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Real Students Data (Currently Empty)
    const usersData = [];

    // Filter Logic
    const filteredUsers = usersData.filter(user => {
        const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.id || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
            case 'Inactive': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Management</h2>
                    <Breadcrumb pageName="Manage student records and admissions" />
                </div>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#8B0000] py-2.5 px-6 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-rose-100 hover:bg-red-950 transition-all active:scale-95 border-b-4 border-red-950">
                    <Plus className="h-4 w-4" />
                    Add New Student
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                {/* Filter/Search Bar */}
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or Roll ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm font-bold outline-none transition-all focus:border-[#8B0000] focus:bg-white focus:ring-4 focus:ring-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-rose-500 dark:focus:ring-rose-900/20"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-8 text-sm font-bold outline-none transition-all hover:border-[#8B0000] focus:border-[#8B0000] focus:ring-4 focus:ring-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-rose-500"
                            >
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Pending</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-slate-50 text-left dark:bg-slate-800/50">
                                <th className="min-w-[220px] py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">
                                    Student Info
                                </th>
                                <th className="min-w-[150px] py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">
                                    Roll No. / Class
                                </th>
                                <th className="min-w-[120px] py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">
                                    Admission Date
                                </th>
                                <th className="min-w-[120px] py-4 px-6 font-semibold text-slate-600 dark:text-slate-400">
                                    Status
                                </th>
                                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-400 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800">
                                                    <img src={user.img} alt="User" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold text-slate-900 dark:text-white">
                                                        {user.name}
                                                    </h5>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">#{user.id}</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{user.grade}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{user.date}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                <button className="rounded-lg p-2 hover:bg-white hover:text-sky-600 hover:shadow-sm dark:hover:bg-slate-800 dark:hover:text-sky-400 transition-all">
                                                    <Eye className="w-4.5 h-4.5" />
                                                </button>
                                                <button className="rounded-lg p-2 hover:bg-white hover:text-sky-600 hover:shadow-sm dark:hover:bg-slate-800 dark:hover:text-sky-400 transition-all">
                                                    <Edit className="w-4.5 h-4.5" />
                                                </button>
                                                <button className="rounded-lg p-2 hover:bg-white hover:text-rose-600 hover:shadow-sm dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-all">
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">
                                        No entries found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Users;
