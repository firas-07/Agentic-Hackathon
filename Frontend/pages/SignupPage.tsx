import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Loader2, ArrowRight, Lock } from 'lucide-react';
import axios from 'axios';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Updated state to include role, default to 'Business User'
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'Business User'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

        try {
            const response = await axios.post(`${baseUrl}/auth/signup`, {
                username: formData.username,
                password: formData.password,
                role: formData.role
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);

            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-slate-200">
                {/* Visual Side */}
                <div className="bg-blue-700 text-white p-12 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900 opacity-20 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 max-w-md mx-auto">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-8 border border-white/20">
                            <Building2 size={24} />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Join Hexa Agent.</h2>
                        <p className="text-blue-100 text-lg leading-relaxed mb-8">
                            Create your professional account to start automating tickets and accessing the knowledge base.
                        </p>

                        <div className="p-4 bg-blue-800/50 rounded-xl border border-blue-500/30">
                            <div className="flex gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                                <p className="text-sm font-medium">Enterprise Ready</p>
                            </div>
                            <p className="text-xs text-blue-200">
                                Seamlessly integrates with your existing Jira and Confluence workflows.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 text-sm mb-8">Enter your details significantly below.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Role Selection - Action Button Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Role</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'End User' })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${formData.role === 'End User'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <User size={20} className="mb-1.5" strokeWidth={2.5} />
                                        <span className="text-sm font-bold">End User</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'Business User' })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${formData.role === 'Business User'
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        <Building2 size={20} className="mb-1.5" strokeWidth={2.5} />
                                        <span className="text-sm font-bold">Business User</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm"
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-sm"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-md bg-blue-700 text-white font-bold text-sm hover:bg-blue-800 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-700 font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
