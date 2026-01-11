import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Shield, Zap, Database, Users, Briefcase, FileText, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Agentic AI Assistant
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-medium text-zinc-300">AI-Powered End-User Support</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50"
                        >
                            Intelligent Support for <br />
                            <span className="text-blue-500">Every User Role</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed"
                        >
                            Seamlessly connecting End Users and Business Users with the right information.
                            Powered by your Confluence knowledge base.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Link
                                to="/signup"
                                className="group relative px-8 py-4 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all hover:scale-105"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
                            >
                                Live Demo
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Role Based Features */}
            <section className="py-24 bg-zinc-900/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* End User Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">End Users</h2>
                            <p className="text-zinc-400 mb-8">For applicants and non-technical users seeking guidance.</p>

                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-zinc-300">Guided application completion assistance based on requirements.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-zinc-300">Collection of basic information for creating new applications.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <span className="text-zinc-300">Instant answers to "How-to" questions from documentation.</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Business User Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                                <Briefcase className="w-7 h-7 text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Business Users</h2>
                            <p className="text-zinc-400 mb-8">For internal teams managing processes and support.</p>

                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-zinc-300">Deep-dive queries into Confluence pages and business logic.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-zinc-300">Guidance on required documentation for member applications.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                        <CheckIcon className="w-3 h-3 text-purple-400" />
                                    </div>
                                    <span className="text-zinc-300">Automated assistance for raising SNOW/JIRA tickets.</span>
                                </li>
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16">Powered by Your Ecosystem</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                            <FileText className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Confluence</h3>
                            <p className="text-zinc-400 text-sm">
                                Direct integration with your Confluence spaces to retrieve business logic and technical docs.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                            <HelpCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">JIRA / SNOW</h3>
                            <p className="text-zinc-400 text-sm">
                                Seamlessly raise tickets and track issues directly through the chat interface.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                            <Database className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Vector Database</h3>
                            <p className="text-zinc-400 text-sm">
                                High-performance semantic search to find the exact answer from thousands of pages.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
