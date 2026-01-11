import React from 'react';
import { ShieldCheck, FileText, HelpCircle } from 'lucide-react';

interface ChatHeroProps {
    onSend: (value: string) => void;
}

export const ChatHero: React.FC<ChatHeroProps> = ({ onSend }) => {
    const role = localStorage.getItem('role') || 'End User';
    const username = localStorage.getItem('username') || 'User';

    const endUserActions = [
        { icon: <FileText size={20} />, title: "Start Application Guidance", desc: "Get help with your application process.", query: "I need guidance for my application" },
        { icon: <ShieldCheck size={20} />, title: "Troubleshoot an Issue", desc: "Resolve common problems.", query: "I need to troubleshoot an issue" },
        { icon: <HelpCircle size={20} />, title: "Raise a Ticket", desc: "Submit a support request.", query: "I want to raise a ticket" },
    ];

    const businessUserActions = [
        { icon: <FileText size={20} />, title: "Search Documentation", desc: "Find detailed policy information.", query: "Search for documentation" },
        { icon: <ShieldCheck size={20} />, title: "Check Required Documents", desc: "Verify application requirements.", query: "What documents are required?" },
        { icon: <HelpCircle size={20} />, title: "Raise Ticket for Applicant", desc: "Submit a ticket on behalf of a user.", query: "Raise a ticket for an applicant" },
    ];

    const actions = role === 'Business User' ? businessUserActions : endUserActions;

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-700 bg-white dark:bg-black">
            {/* Hero Branding */}
            <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 ring-1 ring-white/10 p-0.5">
                    <img
                        src="https://github.com/shadcn.png"
                        alt="AI"
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
                <h2 className="text-4xl font-bold mb-3 tracking-tight text-neutral-900 dark:text-white">
                    Hello, {username}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-lg leading-relaxed font-light">
                    I am your {role} Assistant. How can I help you today?
                </p>
            </div>

            {/* Starter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {actions.map((card, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSend(card.query)}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group"
                    >
                        <div className="p-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                            {card.icon}
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-900 dark:text-neutral-200 mb-1 group-hover:text-black dark:group-hover:text-white transition-colors">{card.title}</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-400 transition-colors leading-relaxed">{card.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
