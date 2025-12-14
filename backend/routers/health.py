from fastapi import APIRouter
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from core.logger import setup_logger
from models.schemas import HealthResponse

logger = setup_logger('health_router')
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
    return {"message": "Agentic AI Assistant API is running"}

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check the health of all services"""
    logger.info("Health check requested")
    try:
        # Check Pinecone connection
        pinecone_status = kb.index.describe_index_stats() if kb else False
        logger.info(f"Pinecone status: {bool(pinecone_status)}")
        
        # Check Azure AI Agent connection
        azure_status = False
        if agent:
            try:
                # Test Azure connection by checking project client
                azure_status = bool(agent.project) and bool(agent.agent_id)
                logger.info(f"Azure Agent status: {azure_status}")
            except Exception as e:
                logger.warning(f"Azure status check failed: {e}")
                azure_status = False
        
        overall_status = "healthy" if pinecone_status and azure_status else "unhealthy"
        logger.info(f"Overall health status: {overall_status}")
        
        return HealthResponse(
            status=overall_status,
            pinecone_connected=bool(pinecone_status),
            gemini_connected=azure_status  # Keeping field name for frontend compatibility
        )
    except Exception as e:
        logger.error(f"Health check error: {e}", exc_info=True)
        return HealthResponse(
            status="unhealthy",
            pinecone_connected=False,
            gemini_connected=False
        )
