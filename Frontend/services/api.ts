import axios from 'axios';
import {
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationsListResponse,
  HealthResponse,
  StatsResponse,
} from '../types';

// Use environment variable for API URL (set this in Vercel to your Backend URL + /api)
// Fallback to localhost for local dev if not set
// We remove any trailing slash to ensure consistency when appending endpoints
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://cyberbytezz-agentic-hackathon-api.hf.space/api').replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  getHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await apiClient.get<StatsResponse>('/stats');
    return response.data;
  },

  getConversations: async (): Promise<ConversationsListResponse> => {
    const response = await apiClient.get<ConversationsListResponse>('/conversations');
    return response.data;
  },

  getConversation: async (threadId: string): Promise<ConversationDetail> => {
    const response = await apiClient.get<ConversationDetail>(`/conversations/${threadId}`);
    return response.data;
  },

  createOrContinueChat: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chat', data);
    return response.data;
  },

  renameConversation: async (threadId: string, newTitle: string): Promise<void> => {
    // Note: API requires title as query param
    await apiClient.put(`/conversations/${threadId}/title`, null, {
      params: { title: newTitle },
    });
  },

  deleteConversation: async (threadId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${threadId}`);
  },
};
