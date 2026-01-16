import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Loader2, Lock, User as UserIcon } from 'lucide-react';
import axios from 'axios';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://cyberbytezz-agentic-hackathon-api.hf.space/api';

        try {
            const response = await axios.post(`${baseUrl}/auth/login`, {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);

            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 font-sans">
            {/* Visual Side */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900 opacity-20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20">
                            <Building2 size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Hexa Agent Assistant</span>
                    </div>

                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        Secure Access to <br /> Business Operations.
                    </h2>

                    <p className="text-blue-100 max-w-md text-lg leading-relaxed">
                        Log in to manage tickets, query documentation, and automate your workflow securely.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-blue-100/60">
                    © 2026 Hexa Agent Inc.
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-50 mb-4 text-blue-700 lg:hidden">
                            <Building2 size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sign in</h1>
                        <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm shadow-sm"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm shadow-sm"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-md bg-blue-700 text-white font-bold text-sm hover:bg-blue-800 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-700 font-bold hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
