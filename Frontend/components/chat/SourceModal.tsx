import React from 'react';
import { BookOpen, X } from 'lucide-react';
import { Source } from '../../types';

interface SourceModalProps {
    selectedSource: Source;
    onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ selectedSource, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                    <div className="flex items-center gap-2 text-indigo-400 font-medium">
                        <BookOpen size={18} />
                        <span className="truncate">{selectedSource.source}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-neutral-300 leading-relaxed whitespace-pre-wrap font-light text-base bg-black/20">
                    {selectedSource.chunk_text}
                </div>
                <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 text-[11px] text-neutral-500 text-center rounded-b-2xl">
                    Verified content retrieved from Knowledge Base
                </div>
            </div>
        </div>
    );
};
