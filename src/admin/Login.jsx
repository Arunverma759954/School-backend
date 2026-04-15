import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

import { API_BASE_URL, API_IMAGE_URL } from '../constants';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [timeoutMessage, setTimeoutMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeoutMessage('');

        // Show a message after 4 seconds if the Render free-tier is taking time to wake up
        const slowServerTimer = setTimeout(() => {
            setTimeoutMessage("Waking up secure servers... This may take up to 50 seconds on first load.");
        }, 4000);

        const fetchURL = `${API_BASE_URL}/login`;
        console.log("Attempting login at:", fetchURL);

        try {
            const response = await fetch(fetchURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log("Response Status:", response.status);
            const data = await response.json();
            
            clearTimeout(slowServerTimer);
            setTimeoutMessage('');

            if (response.ok) {
                setIsSuccess(true);
                login(data);
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
            } else {
                setError(data.message || 'Invalid email or password');
                setLoading(false);
            }
        } catch (err) {
            clearTimeout(slowServerTimer);
            setTimeoutMessage('');
            console.error("Login Error Details:", err);
            setError('Server connection failed. Please check if backend is running.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-100/20 blur-[120px] dark:bg-rose-900/10"></div>
                <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rose-50/20 blur-[120px] dark:bg-rose-900/10"></div>
            </div>

            <div className="max-w-md w-full mx-4 z-10 transition-all duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className={`inline-flex h-24 w-24 items-center justify-center rounded-3xl shadow-xl mb-8 transition-all duration-500 overflow-hidden bg-white p-2 border border-slate-100 ${isSuccess ? 'scale-110' : 'bg-white'}`}>
                            {isSuccess ? <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" /> : <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tighter uppercase">
                            {isSuccess ? 'Access Granted' : 'Institutional Portal'}
                        </h1>
                        <p className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">St. Joseph's Convent School</p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 text-sm text-center font-bold dark:bg-rose-900/20 dark:text-rose-400 animate-in fade-in duration-300 border border-rose-100 dark:border-rose-900/20">
                                    {error.toUpperCase()}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-4 text-slate-900 font-bold outline-none transition-all focus:border-[#8B0000] focus:bg-white focus:ring-4 focus:ring-rose-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/20 dark:focus:border-[#8B0000] placeholder:text-slate-300"
                                        placeholder="admin@school.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#8B0000] transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-4 text-slate-900 font-bold outline-none transition-all focus:border-[#8B0000] focus:bg-white focus:ring-4 focus:ring-rose-50 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:ring-rose-900/20 dark:focus:border-[#8B0000] placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-[#8B0000] py-4 text-white font-bold shadow-xl shadow-rose-100 dark:shadow-none hover:bg-red-950 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-b-4 border-red-950 text-[10px] tracking-widest"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        AUTHENTICATING...
                                    </div>
                                ) : (
                                    <>
                                        ACCESS DASHBOARD <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                            {timeoutMessage && (
                                <div className="mt-4 p-3 rounded-xl bg-orange-50 text-orange-600 text-xs text-center font-bold dark:bg-orange-900/20 dark:text-orange-400 animate-in fade-in duration-300 border border-orange-100 dark:border-orange-900/20">
                                    {timeoutMessage}
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-emerald-500 animate-progress"></div>
                            </div>
                            <p className="font-bold text-emerald-600 uppercase tracking-widest text-xs">Redirecting to Secure Panel...</p>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            System Security Powered By <br/>
                            <a href="#" className="text-sky-600 hover:text-sky-700">Digital Solutions 360</a>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-12 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    &copy; 2026 SJCS Management • v4.0.0-PRO
                </p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 1.5s ease-in-out forwards;
                }
            `}} />
        </div>
    );
};

export default Login;
