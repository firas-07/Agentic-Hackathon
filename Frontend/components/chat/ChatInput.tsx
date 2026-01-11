import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: (e?: React.FormEvent) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    isPending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSend, handleKeyDown, isPending }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    return (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white dark:from-black dark:via-black to-transparent pt-10 pb-2 px-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSend} className="relative flex items-end w-full bg-neutral-100 dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700/50 shadow-sm transition-colors">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message..."
                        className="w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none !shadow-none !ring-0 py-3.5 pl-5 pr-12 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 max-h-[200px] overflow-y-auto leading-relaxed"
                        style={{ minHeight: '52px' }}
                    />
                    <button
                        type="submit"
                        disabled={isPending || !input.trim()}
                        className="absolute right-2 bottom-2 p-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-black dark:disabled:hover:bg-white transition-all shadow-sm flex items-center justify-center m-0.5"
                    >
                        <Send size={16} strokeWidth={2} className={input.trim() ? "ml-0.5" : ""} />
                    </button>
                </form>
                <div className="text-center text-[10px] text-neutral-400 dark:text-neutral-600 mt-2 mb-1 tracking-wide">
                    Agentic AI Assistant may display inaccurate info.
                </div>
            </div>
        </div>
    );
};
