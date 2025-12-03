from fastapi import APIRouter
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from models.schemas import HealthResponse

router = APIRouter()

# Global instances
kb = None
agent = None

def set_instances(kb_instance, agent_instance):
    """Set the global instances"""
    global kb, agent
    kb = kb_instance
    agent = agent_instance

@router.get("/", tags=["Health"])
async def root():
    return {"message": "Agentic RAG System API is running"}

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check the health of all services"""
    try:
        # Check Pinecone connection
        pinecone_status = kb.index.describe_index_stats() if kb else False
        
        # Check Gemini connection (simple test)
        gemini_status = bool(agent) and bool(agent.gemini_client)
        
        return HealthResponse(
            status="healthy" if pinecone_status and gemini_status else "unhealthy",
            pinecone_connected=bool(pinecone_status),
            gemini_connected=gemini_status
        )
    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            pinecone_connected=False,
            gemini_connected=False
        )
