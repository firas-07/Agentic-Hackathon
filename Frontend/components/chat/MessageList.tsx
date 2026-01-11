import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, BookOpen } from 'lucide-react';
import { Message, Source } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';

interface MessageListProps {
    localMessages: Message[];
    isHistoryLoading: boolean;
    error: any;
    isPending: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ localMessages, isHistoryLoading, error, isPending }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localMessages, isHistoryLoading, isPending]);

    return (
        <div className="flex-1 overflow-y-auto w-full">
            <div className="flex flex-col pb-40 pt-6 px-4 max-w-3xl mx-auto w-full gap-3">
                {isHistoryLoading && <div className="p-8 text-center text-neutral-500 animate-pulse">Loading history...</div>}
                {error && <div className="p-8 text-center text-red-400 bg-red-400/10 rounded-lg mx-auto">Error loading conversation</div>}

                {localMessages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div
                            key={idx}
                            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
              flex gap-3 max-w-[85%] md:max-w-[75%] 
              ${isUser ? 'flex-row-reverse' : 'flex-row'}
           `}>
                                {/* Avatar */}
                                <div className={`
                w-8 h-8 shrink-0 rounded-full flex items-center justify-center shadow-lg border overflow-hidden
                ${isUser
                                        ? 'bg-white dark:bg-neutral-200 text-black border-neutral-200 dark:border-white/20'
                                        : 'bg-indigo-600 text-white border-indigo-500/30'
                                    }
              `}>
                                    {isUser ? (
                                        <User size={16} />
                                    ) : (
                                        <img
                                            src="https://github.com/shadcn.png"
                                            alt="AI"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`
                flex flex-col overflow-hidden shadow-xl
                ${isUser
                                        ? 'bg-neutral-200 dark:bg-neutral-100 text-black rounded-2xl rounded-tr-sm'
                                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200 rounded-2xl rounded-tl-sm'
                                    }
              `}>
                                    <div className={`px-4 py-2.5 ${isUser ? 'text-[15px]' : 'text-[15px] leading-7'}`}>
                                        {isUser ? (
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        ) : (
                                            <div className="markdown prose dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-neutral-900 dark:text-white mb-1 mt-2 first:mt-0" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-base font-semibold text-neutral-900 dark:text-white mb-1 mt-2" {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 mt-1.5" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-neutral-600 dark:text-neutral-300" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-0.5 text-neutral-600 dark:text-neutral-300" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5 text-neutral-600 dark:text-neutral-300" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-600 dark:text-indigo-300" {...props} />,
                                                        a: ({ node, ...props }) => <a className="text-indigo-500 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-indigo-500 pl-4 py-1 my-2 bg-neutral-100 dark:bg-white/5 rounded-r text-neutral-500 dark:text-neutral-400 italic" {...props} />,
                                                        code: ({ node, ...props }) => <code className="bg-neutral-100 dark:bg-black/30 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono border border-neutral-200 dark:border-white/10" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sources Footer */}
                                    {!isUser && msg.sources && msg.sources.length > 0 && (
                                        <div className="bg-neutral-50 dark:bg-black/20 border-t border-neutral-200 dark:border-white/5 p-3 space-y-2 relative">
                                            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-[10px] uppercase tracking-wider font-semibold px-1">
                                                <BookOpen size={12} />
                                                <span className="opacity-70">Sources found</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {(() => {
                                                    const uniqueSources = msg.sources?.reduce((acc: Source[], current) => {
                                                        const x = acc.find(item => item.source === current.source);
                                                        if (!x) {
                                                            return acc.concat([current]);
                                                        } else {
                                                            return acc;
                                                        }
                                                    }, []);

                                                    return uniqueSources?.map((source, i) => (
                                                        <div
                                                            key={i}
                                                            className="
                                  bg-white dark:bg-black/40 border border-neutral-200 dark:border-white/5
                                  p-2.5 rounded-lg transition-all
                                "
                                                        >
                                                            <div className="font-medium text-indigo-500 dark:text-indigo-400 text-xs mb-0.5 truncate flex items-center gap-1">
                                                                <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                                                                {source.source}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isPending && (
                    <div className="flex w-full justify-start">
                        <div className="flex gap-4 max-w-[75%]">
                            <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border border-indigo-500/30 overflow-hidden">
                                <img
                                    src="https://github.com/shadcn.png"
                                    alt="AI"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-xl flex items-center gap-3">
                                <LoadingSpinner size={18} />
                                <span className="text-sm font-medium bg-gradient-to-r from-neutral-500 to-neutral-800 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent animate-pulse">Processing...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
