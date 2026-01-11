import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ConversationDetail, Message, Source } from '../types';
import { ChatHero } from './chat/ChatHero';
import { ChatInput } from './chat/ChatInput';
import { MessageList } from './chat/MessageList';

interface ChatAreaProps {
    activeThreadId: string | null;
    onThreadCreated: (id: string) => void;
    toggleSidebar: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ activeThreadId, onThreadCreated }) => {
    const queryClient = useQueryClient();
    const [input, setInput] = useState('');

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
        onSuccess: (data, variables) => {
            const aiMsg: Message = {
                role: 'assistant',
                content: data.answer,
                timestamp: new Date().toISOString(),
                sources: data.sources
            };

            const userMsg: Message = {
                role: 'user',
                content: variables.query,
                timestamp: new Date().toISOString()
            };

            setLocalMessages((prev) => [...prev, aiMsg]);

            // Update the cache directly with the new messages to avoid needing a refetch
            // This ensures we display the /chat response immediately and persist it in the client state
            queryClient.setQueryData<ConversationDetail>(['conversation', data.thread_id], (old) => {
                if (!old) {
                    return {
                        title: 'New Chat',
                        messages: [userMsg, aiMsg]
                    };
                }
                return {
                    ...old,
                    messages: [...old.messages, userMsg, aiMsg]
                };
            });

            // If this was a new chat, notify parent to update URL/State
            if (!activeThreadId && data.thread_id) {
                onThreadCreated(data.thread_id);
            }

            // Invalidate list to show updated message count or new chat
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: (err) => {
            console.error(err);
            alert('Failed to send message. Check the backend connection.');
        }
    });

    const handleSend = (e?: React.FormEvent, queryOverride?: string) => {
        e?.preventDefault();
        const queryToSend = queryOverride || input;
        if (!queryToSend.trim() || mutation.isPending) return;

        mutation.mutate({
            query: queryToSend,
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
        <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-black rounded-none overflow-hidden">
            {/* Messages Area OR Hero */}
            {!activeThreadId && localMessages.length === 0 ? (
                <ChatHero onSend={(query) => handleSend(undefined, query)} />
            ) : (
                <MessageList
                    localMessages={localMessages}
                    isHistoryLoading={isHistoryLoading}
                    error={error}
                    isPending={mutation.isPending}
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

        </div>
    );
};