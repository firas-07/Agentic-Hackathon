from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QueryRequest(BaseModel):
    query: str
    thread_id: Optional[str] = None
    top_k: Optional[int] = 10

class QueryResponse(BaseModel):
    answer: str
    thread_id: str
    conversation_title: Optional[str] = None
    sources: List[dict]
    confidence_scores: List[float]

class IngestResponse(BaseModel):
    message: str
    documents_processed: int
    chunks_uploaded: int

class HealthResponse(BaseModel):
    status: str
    pinecone_connected: bool
    gemini_connected: bool

class SourceInfo(BaseModel):
    source: str
    chunk_text: str
    chunk_index: int

class MatchInfo(BaseModel):
    score: float
    source: SourceInfo

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str
    sources: Optional[List[dict]] = None

class Conversation(BaseModel):
    thread_id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int

class ConversationDetail(BaseModel):
    thread_id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[Message]

class ConversationListResponse(BaseModel):
    conversations: List[Conversation]

class CreateConversationResponse(BaseModel):
    thread_id: str
    title: str
    created_at: str
