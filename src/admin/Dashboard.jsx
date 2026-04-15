import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  Image as ImageIcon,
  PlusCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { API_BASE_URL } from '../constants';

const Dashboard = () => {
    const [stats, setStats] = useState({ students: 0, staff: 0, events: 0, enquiries: 0 });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/stats`, {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    const series = [
        {
            name: 'Record Volume',
            data: [0, 0, 0, 0, 0, stats.students, stats.students + stats.enquiries],
        },
        {
            name: 'Activity',
            data: [0, 0, 0, 0, 0, stats.enquiries, stats.enquiries + stats.events],
        },
    ];

    const options = {
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
        },
        colors: ['#8B0000', '#FFD700'],
        chart: {
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            height: 335,
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            }
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        },
    };

    return (
        <div className="flex flex-col gap-8 p-1">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {/* Total Students */}
                <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-[#8B0000] dark:bg-rose-950/30">
                            <GraduationCap className="h-7 w-7" />
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:bg-emerald-950/30">
                            System Active
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                            {loading ? '...' : String(stats.students).padStart(2, '0')}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Active Students (TCs)</p>
                    </div>
                </div>

                {/* Total Stats 2 */}
                <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/30">
                            <Users className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
                             {loading ? '...' : String(stats.staff).padStart(2, '0')}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Staff Members</p>
                    </div>
                </div>

                {/* Events Feed */}
                <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                            <CalendarCheck className="h-7 w-7" />
                        </div>
                         <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8B0000] dark:bg-sky-950/30">
                            {loading ? '-' : stats.events} LIVE
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter"> {loading ? '...' : 'Live'}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Event Feed Status</p>
                    </div>
                </div>

                {/* Enquiries */}
                <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/30">
                            <CreditCard className="h-7 w-7" />
                        </div>
                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:bg-rose-950/30">
                            {loading ? '-' : stats.enquiries} NEW
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Active</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Admission Inbox</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Analytics */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Growth Analytics</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time dynamic data trends</p>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ReactApexChart options={options} series={series} type="area" height="100%" />
                    </div>
                </div>

                <div className="col-span-12 flex flex-col gap-6 xl:col-span-4">
                    {/* Dynamic Gallery Quick Action */}
                    <div className="rounded-3xl bg-gradient-to-br from-[#8B0000] to-red-950 p-8 text-white shadow-xl shadow-rose-100 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <ImageIcon size={120} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">School Gallery</h4>
                            <p className="text-rose-100 text-[10px] font-bold mb-6 leading-relaxed uppercase tracking-widest">Manage memories on the live website.</p>
                            <Link to="/admin/gallery" className="inline-flex items-center gap-2 bg-white text-[#8B0000] px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 group/btn">
                                Manage Photos <PlusCircle className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Recent Updates</h4>
                            <Link to="/admin/users" className="text-[10px] font-bold text-[#8B0000] hover:underline flex items-center gap-1 uppercase tracking-widest">
                                Manage Records <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No recent alerts found</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
