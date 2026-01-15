import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight, MessageSquare, Ticket, FileText,
    CheckCircle2, Building2, ShieldCheck, Zap,
    ArrowUpRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Navbar - Simplified */}
            <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white shadow-md">
                            <Building2 size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Hexa Agent Assistant</span>
                    </div>
                    {/* Right Side Actions Only */}
                    <div className="flex items-center gap-4">
                        <Link to="/signup" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors">
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            className="bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            Enterprise Ready
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.15]">
                            Business Query <br /> & <span className="text-blue-700">Ticket Automation</span>.
                        </h1>

                        <p className="text-xl text-slate-500 mb-8 leading-relaxed">
                            Hexa Agent Assistant helps you resolve business queries—like filling out complex forms—and instantly raises Jira tickets for any issues.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/login"
                                className="h-14 px-8 rounded-md bg-blue-700 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
                            >
                                Start Automation
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Chat Interface Mockup - Business Form Query & Ticket Raising */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Background Decorative Blob */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>

                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                            {/* Window Header */}
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-xs font-semibold text-slate-400">Hexa Agent / Support</div>
                            </div>

                            {/* Chat Content */}
                            <div className="p-6 space-y-6 bg-slate-50/50 h-[500px]">
                                {/* User Query: Form Filling */}
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-600/10 max-w-[85%]">
                                        <p className="text-sm">
                                            I'm stuck on the <strong>Project Budget Request</strong> form. What is the Cost Center code for Marketing?
                                        </p>
                                    </div>
                                </div>

                                {/* AI Response 1: Form Guidance */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                                        <Building2 size={20} className="text-blue-700" />
                                    </div>
                                    <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] space-y-3">
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            According to the <strong>Finance Handbook 2024</strong>, the Marketing Cost Center code is <strong>MKT-2024</strong>.
                                        </p>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-blue-700 cursor-pointer hover:bg-blue-50">
                                                <FileText size={14} />
                                                Open Finance Handbook
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Query: Issue */}
                                <div className="flex justify-end">
                                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-blue-600/10 max-w-[85%]">
                                        <p className="text-sm">
                                            Thanks. When I click submit, the form freezes and gives a timeout error.
                                        </p>
                                    </div>
                                </div>

                                {/* AI Response 2: Ticket Raising */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                                        <Building2 size={20} className="text-blue-700" />
                                    </div>
                                    <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] space-y-4">
                                        <p className="text-sm text-slate-700">
                                            I've detected the timeout. I'm raising a priority ticket for the IT Support team.
                                        </p>

                                        {/* Mock Jira Ticket Card */}
                                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                                                <div className="w-4 h-4 bg-blue-500 rounded text-[10px] flex items-center justify-center text-white font-bold">J</div>
                                                <span className="text-xs font-semibold text-slate-700">New Ticket Created</span>
                                            </div>
                                            <div className="p-4">
                                                <div className="text-sm font-bold text-slate-900 mb-1">Form Submission Timeout - Budget Request</div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded font-medium">High Priority</span>
                                                    <span>Assignee: IT Support</span>
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    User reported freezing/timeout on Budget Request form submission.
                                                </p>
                                            </div>
                                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex gap-3">
                                                <button className="flex-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold py-2 rounded hover:bg-slate-50 transition-colors">View Ticket #DEV-4029</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 px-6 bg-white" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <FeatureColumn
                            icon={<FileText className="text-blue-600" size={24} />}
                            title="Form Assistance"
                            description="Never get stuck on internal paperwork. Hexa Agent guides you through complex forms and processes step-by-step."
                        />
                        <FeatureColumn
                            icon={<Ticket className="text-blue-600" size={24} />}
                            title="Instant Ticketing"
                            description="Turn reported issues into Jira tickets instantly. The AI captures context and logs them for the right team."
                        />
                        <FeatureColumn
                            icon={<ShieldCheck className="text-blue-600" size={24} />}
                            title="Secure Operations"
                            description="Enterprise-grade security ensures your internal data and queries remain protected at all times."
                        />
                    </div>
                </div>
            </section>

            {/* Footer - Dark Theme */}
            <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <Building2 size={18} />
                                </div>
                                <span className="text-lg font-bold text-white">Hexa Agent Assistant</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">
                                AI-powered operations platform for modern enterprises.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm">Product</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-blue-400">Features</a></li>
                                <li><a href="#" className="hover:text-blue-400">Security</a></li>
                                <li><a href="#" className="hover:text-blue-400">Enterprise</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm">Company</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-blue-400">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                        <div>© 2026 Hexa Agent Inc. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureColumn = ({ icon, title, description }: any) => (
    <div className="group">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);
