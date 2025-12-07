import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Message, Source } from '../types';
import { ChatHero } from './chat/ChatHero';
import { ChatInput } from './chat/ChatInput';
import { MessageList } from './chat/MessageList';
import { SourceModal } from './chat/SourceModal';

interface ChatAreaProps {
    activeThreadId: string | null;
    onThreadCreated: (id: string) => void;
    toggleSidebar: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ activeThreadId, onThreadCreated }) => {
    const queryClient = useQueryClient();
    const [input, setInput] = useState('');
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);

    // Local state for messages to handle immediate UI updates
    const [localMessages, setLocalMessages] = useState<Message[]>([]);

    // Fetch conversation history
    const { data: conversationData, isLoading: isHistoryLoading, error } = useQuery({
        queryKey: ['conversation', activeThreadId],
        queryFn: () => api.getConversation(activeThreadId!),
        enabled: !!activeThreadId,
    });

    // Sync local messages with fetched data
    useEffect(() => {
        if (conversationData) {
            setLocalMessages(conversationData.messages);
        } else if (!activeThreadId) {
            setLocalMessages([]);
        }
    }, [conversationData, activeThreadId]);

    const mutation = useMutation({
        mutationFn: api.createOrContinueChat,
        onMutate: async (newChatRequest) => {
            // Optimistic update
            const userMsg: Message = { role: 'user', content: newChatRequest.query, timestamp: new Date().toISOString() };
            setLocalMessages((prev) => [...prev, userMsg]);
            setInput('');
        },
        onSuccess: (data) => {
            const aiMsg: Message = {
                role: 'assistant',
                content: data.answer,
                timestamp: new Date().toISOString(),
                sources: data.sources
            };
            setLocalMessages((prev) => [...prev, aiMsg]);

            // If this was a new chat, notify parent to update URL/State
            if (!activeThreadId && data.thread_id) {
                onThreadCreated(data.thread_id);
            }

            // Invalidate list to show updated message count or new chat
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            // Invalidate current chat to ensure sync
            if (data.thread_id) {
                queryClient.invalidateQueries({ queryKey: ['conversation', data.thread_id] });
            }
        },
        onError: (err) => {
            console.error(err);
            alert('Failed to send message. Check the backend connection.');
        }
    });

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || mutation.isPending) return;

        mutation.mutate({
            query: input,
            thread_id: activeThreadId || undefined,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-black rounded-none overflow-hidden">
            {/* Messages Area OR Hero */}
            {!activeThreadId && localMessages.length === 0 ? (
                <ChatHero setInput={(query) => {
                    setInput(query);
                    // Optional: auto-send or focus input. 
                    // Current implementation just sets input state. 
                }} />
            ) : (
                <MessageList
                    localMessages={localMessages}
                    isHistoryLoading={isHistoryLoading}
                    error={error}
                    isPending={mutation.isPending}
                    setSelectedSource={setSelectedSource}
                />
            )}

            {/* Input Area */}
            <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleKeyDown={handleKeyDown}
                isPending={mutation.isPending}
            />

            {/* Source Details Modal */}
            {selectedSource && (
                <SourceModal selectedSource={selectedSource} onClose={() => setSelectedSource(null)} />
            )}
        </div>
    );
};