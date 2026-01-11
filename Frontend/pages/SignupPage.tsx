import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<'End User' | 'Business User'>('End User');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
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

        try {
            const response = await axios.post('http://localhost:8000/api/auth/signup', {
                username: formData.username,
                password: formData.password,
                role: role
            });

            // Store token and user info
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);

            // Redirect to chat
            navigate('/chat');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-zinc-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-900 to-zinc-900" />
                <div className="relative z-10 max-w-md text-center p-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl mx-auto mb-8 flex items-center justify-center"
                    >
                        <Bot className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">Join the Future of Work</h2>
                    <p className="text-zinc-400">Create an account to access your personalized AI assistant and enterprise knowledge base.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-zinc-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('End User')}
                                className={cn(
                                    "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                                    role === 'End User'
                                        ? "bg-blue-600/10 border-blue-500 text-blue-500"
                                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                )}
                            >
                                <User className="w-6 h-6" />
                                <span className="text-sm font-medium">End User</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('Business User')}
                                className={cn(
                                    "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                                    role === 'Business User'
                                        ? "bg-blue-600/10 border-blue-500 text-blue-500"
                                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                )}
                            >
                                <Building2 className="w-6 h-6" />
                                <span className="text-sm font-medium">Business User</span>
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="johndoe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
