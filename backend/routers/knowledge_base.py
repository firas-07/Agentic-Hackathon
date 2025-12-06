from fastapi import APIRouter, HTTPException
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from core.logger import setup_logger
from services.knowledge_base import KnowledgeBase
from models.schemas import IngestResponse

logger = setup_logger('knowledge_base_router')
router = APIRouter()

# Global knowledge base instance
kb = None

def set_kb_instance(kb_instance):
    """Set the global knowledge base instance"""
    global kb
    kb = kb_instance

@router.post("/ingest", response_model=IngestResponse, tags=["Knowledge Base"])
async def ingest_documents():
    """Ingest documents from Confluence into Pinecone"""
    try:
        if not kb:
            raise Exception("Knowledge base not initialized")
        
        # Run the pipeline
        kb.run_pipeline()
        
        # Get statistics
        total_docs = len(kb.documents)
        total_chunks = sum(len(kb.chunk_text(doc['content'])) for doc in kb.documents)
        
        return IngestResponse(
            message="Documents ingested successfully",
            documents_processed=total_docs,
            chunks_uploaded=total_chunks
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.get("/stats", tags=["Knowledge Base"])
async def get_index_stats():
    """Get statistics about the Pinecone index"""
    try:
        if not kb:
            raise Exception("Knowledge base not initialized")
        
        stats = kb.index.describe_index_stats()
        return {
            "total_vector_count": stats.get('total_vector_count', 0),
            "dimension": stats.get('dimension', 0),
            "index_fullness": stats.get('index_fullness', 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")
