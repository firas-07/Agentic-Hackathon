import React from 'react';
import { ShieldCheck, FileText, HelpCircle } from 'lucide-react';

interface ChatHeroProps {
    setInput: (value: string) => void;
}

export const ChatHero: React.FC<ChatHeroProps> = ({ setInput }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
            {/* Hero Branding */}
            <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 ring-1 ring-white/10 p-0.5">
                    <img
                        src="https://github.com/shadcn.png"
                        alt="AI"
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>
                <h2 className="text-4xl font-bold mb-3 tracking-tight text-white">
                    How can I help you?
                </h2>
                <p className="text-neutral-400 max-w-md text-lg leading-relaxed font-light">
                    I can assist with documentation, troubleshooting, and retrieving secure information.
                </p>
            </div>

            {/* Starter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                    { icon: <ShieldCheck size={20} />, title: "Troubleshoot Issue", desc: "Guide me through raising a support ticket.", query: "i want to raise a ticket" },
                    { icon: <FileText size={20} />, title: "Documentation", desc: "Find specifics about company policies.", query: "show me recent policy documents" },
                    { icon: <HelpCircle size={20} />, title: "General Help", desc: "What capabilities do you have?", query: "what can you help me with?" },
                ].map((card, idx) => (
                    <button
                        key={idx}
                        onClick={() => setInput(card.query)}
                        className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:bg-neutral-800/60 hover:border-neutral-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-left group"
                    >
                        <div className="p-2.5 rounded-xl bg-neutral-800/50 text-neutral-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                            {card.icon}
                        </div>
                        <div>
                            <div className="font-semibold text-neutral-200 mb-1 group-hover:text-white transition-colors">{card.title}</div>
                            <div className="text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors leading-relaxed">{card.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
