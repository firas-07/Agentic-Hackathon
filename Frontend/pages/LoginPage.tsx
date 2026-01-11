import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Loader2, Lock, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', {
                username: formData.username,
                password: formData.password
            });

            // Store token and user info
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);

            // Redirect to chat
            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-indigo-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-12 z-10 border-r border-white/5 bg-white/[0.02]">
                <div className="relative z-10 max-w-lg text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto mb-10 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(79,70,229,0.3)]"
                    >
                        <Bot className="w-16 h-16 text-white" />
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                    >
                        Welcome Back
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="text-lg text-zinc-400 leading-relaxed"
                    >
                        Your intelligent assistant is ready to help. <br />
                        Access your knowledge base, track tickets, and get answers instantly.
                    </motion.p>
                </div>

                {/* Decorative Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 z-10">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold mb-3 tracking-tight">Log in</h1>
                        <p className="text-zinc-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Username</label>
                                <div className={cn(
                                    "relative group transition-all duration-300 rounded-xl overflow-hidden bg-zinc-900/50 border",
                                    focusedField === 'username' ? "border-indigo-500/50 ring-2 ring-indigo-500/20" : "border-white/10 hover:border-white/20"
                                )}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <UserIcon size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder:text-zinc-600 outline-none"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Link to="#" className="float-right text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Forgot password?</Link>
                                <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
                                <div className={cn(
                                    "relative group transition-all duration-300 rounded-xl overflow-hidden bg-zinc-900/50 border",
                                    focusedField === 'password' ? "border-indigo-500/50 ring-2 ring-indigo-500/20" : "border-white/10 hover:border-white/20"
                                )}>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-transparent text-white placeholder:text-zinc-600 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold tracking-wide hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
