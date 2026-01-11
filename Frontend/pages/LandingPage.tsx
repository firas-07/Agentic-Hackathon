import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Bot, Shield, Zap, Database, Users, Briefcase, FileText, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
            <BackgroundGrid />

            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                            Agentic Chat Assistant
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="group relative px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold tracking-wide hover:bg-zinc-200 transition-all overflow-hidden"
                        >
                            <span className="relative z-10">Get Started</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Role Based Features */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-zinc-900/0" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                            Orchestrated for Everyone
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Whether you need guidance or you're managing the process, our intelligent agents adapt to your role.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        <RoleCard
                            title="End Users"
                            description="For applicants and non-technical users seeking guidance and clarity."
                            icon={<Users className="w-8 h-8 text-blue-400" />}
                            features={[
                                "Guided application completion",
                                "Instant answers from documentation",
                                "Personalized requirements checklist"
                            ]}
                            gradient="from-blue-500/20 to-cyan-500/20"
                            border="group-hover:border-blue-500/50"
                        />
                        <RoleCard
                            title="Business Users"
                            description="For internal teams managing processes, support, and documentation."
                            icon={<Briefcase className="w-8 h-8 text-purple-400" />}
                            features={[
                                "Deep technical deep-dives",
                                "Automated ticket creation (JIRA/SNOW)",
                                "Business logic analysis"
                            ]}
                            gradient="from-purple-500/20 to-pink-500/20"
                            border="group-hover:border-purple-500/50"
                        />
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-32 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Powered by your <br />
                                <span className="text-indigo-500">Knowledge Ecosystem</span>
                            </h2>
                            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                We don't just chat. We connect deeply with your existing tools to provide actionable insights and real-time resolution.
                            </p>

                            <div className="flex flex-col gap-4">
                                <IntegrationItem
                                    icon={<FileText className="w-5 h-5 text-blue-400" />}
                                    title="Confluence"
                                    desc="Real-time syncing with your spaces for up-to-date answers."
                                />
                                <IntegrationItem
                                    icon={<HelpCircle className="w-5 h-5 text-green-400" />}
                                    title="JIRA & ServiceNow"
                                    desc="Raise tickets and track statuses without leaving the conversation."
                                />
                                <IntegrationItem
                                    icon={<Database className="w-5 h-5 text-purple-400" />}
                                    title="Vector Database"
                                    desc="Semantic search that finds the needle in the haystack."
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 animate-pulse" />
                            <div className="relative rounded-2xl bg-black border border-white/10 p-2 overflow-hidden">
                                <div className="rounded-xl bg-zinc-900/50 p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-20">
                                        <Bot className="w-64 h-64 text-white rotate-12" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="bg-white/5 border border-white/5 rounded-lg p-4 max-w-[80%]">
                                            <div className="h-2 w-20 bg-zinc-700/50 rounded mb-2" />
                                            <div className="h-2 w-full bg-zinc-700/50 rounded" />
                                        </div>
                                        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-4 max-w-[80%] self-end">
                                            <div className="h-2 w-32 bg-indigo-400/30 rounded mb-2" />
                                            <div className="h-2 w-24 bg-indigo-400/30 rounded" />
                                        </div>
                                        <div className="flex gap-2 justify-center mt-12">
                                            <span className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '0s' }} />
                                            <span className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <span className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-zinc-500" />
                        <span className="font-semibold text-zinc-400">Agentic Chat Assistant</span>
                    </div>
                    <div className="text-sm text-zinc-600">
                        © 2024 Agentic AI Hackathon. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Sub Components ---

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f630,transparent)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default"
                >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-medium text-zinc-300">Next Gen Enterprise AI</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50">
                        Intelligence,
                    </span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-2">
                        Democratized.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Bridge the gap between complex knowledge bases and instant answers.
                    Empower every user role with context-aware AI support.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/signup"
                        className="group relative px-8 py-4 rounded-full bg-indigo-600 text-white font-bold tracking-wide hover:bg-indigo-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)]"
                    >
                        Start Free Trial
                        <ChevronRight className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-all"
                    >
                        View Demo
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

const RoleCard = ({ title, description, icon, features, gradient, border }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className={`group relative p-8 md:p-10 rounded-3xl bg-zinc-900/40 border border-white/5 ${border} hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${gradient} blur-3xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 translate-x-1/2 -translate-y-1/2`} />

            <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                <h3 className="text-3xl font-bold mb-4">{title}</h3>
                <p className="text-zinc-400 mb-10 text-lg">{description}</p>

                <ul className="space-y-4">
                    {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

const IntegrationItem = ({ icon, title, desc }: any) => (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
        <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-lg mb-1">{title}</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const BackgroundGrid = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-indigo-900/10 to-transparent" />
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-t from-black via-black/80 to-transparent" />
    </div>
);
