from fastapi import APIRouter, HTTPException
from typing import List
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from core.config import *
from core.logger import setup_logger
from services.agent import Agent
from models.schemas import QueryRequest, QueryResponse

logger = setup_logger('chat_router')
router = APIRouter()

# Global agent instance
agent = None

def set_agent_instance(agent_instance):
    """Set the global agent instance"""
    global agent
    agent = agent_instance

@router.post("/chat", response_model=QueryResponse, tags=["Chat"])
async def chat_with_knowledge_base(request: QueryRequest):
    """Chat with the knowledge base with a natural language question"""
    logger.info(f"=== New Chat Request ===")
    logger.info(f"Query: '{request.query}'")
    logger.info(f"Top K: {request.top_k}")
    
    try:
        if not agent:
            logger.error("Agent not initialized")
            raise Exception("Agent not initialized")
        
        logger.info("Searching knowledge base...")
        # Search knowledge base
        matches = agent.search_knowledge_base(request.query, request.top_k)
        
        if not matches:
            logger.warning("No matches found in knowledge base")
            return QueryResponse(
                answer="I couldn't find any information about that in the knowledge base.",
                sources=[],
                confidence_scores=[]
            )
        
        logger.info(f"Found {len(matches)} matches, generating answer...")
        # Generate answer
        answer = agent.generate_answer(request.query, matches)
        
        # Extract sources and scores
        sources = []
        confidence_scores = []
        
        for match in matches:
            sources.append({
                "source": match['metadata']['source'],
                "chunk_text": match['metadata']['chunk_text'][:200] + "...",
                "chunk_index": match['metadata']['chunk_index']
            })
            confidence_scores.append(match['score'])
        
        logger.info(f"Successfully generated answer (length: {len(answer)} chars)")
        logger.info(f"Returning {len(sources)} sources with confidence scores: {confidence_scores}")
        
        return QueryResponse(
            answer=answer,
            sources=sources,
            confidence_scores=confidence_scores
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
