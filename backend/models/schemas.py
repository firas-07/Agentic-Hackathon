from pydantic import BaseModel
from typing import List, Optional

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class QueryResponse(BaseModel):
    answer: str
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
