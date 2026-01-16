export interface HealthResponse {
  status: string;
  pinecone_connected: boolean;
  gemini_connected: boolean;
}

export interface StatsResponse {
  total_vector_count: number;
  dimension: number;
  index_fullness: number;
}

export interface Source {
  source: string;
  chunk_text: string;
  chunk_index: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  // Sources might be enriched into the message object for display
  sources?: Source[];
}

export interface ConversationSummary {
  thread_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ConversationDetail {
  title: string;
  messages: Message[];
}

export interface ChatRequest {
  query: string;
  thread_id?: string;
}

export interface ChatResponse {
  answer: string;
  thread_id: string;
  sources: Source[];
}

export interface ConversationsListResponse {
  conversations: ConversationSummary[];
}
